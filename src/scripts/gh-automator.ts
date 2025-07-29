import { parseIssue } from "@github/issue-parser";
import { Octokit } from "@octokit/rest";
import fs from "fs";
import path from "path";
import { z } from "zod";
import { dataSchema } from "../utils/data-schema";
import { issueSchema } from "$/lib/config/gh-automator";

const TEMPLATES_DIR = path.join(process.cwd(), ".github", "ISSUE_TEMPLATE");

const TEMPLATE = path.join(TEMPLATES_DIR, "gh-automator.yaml");

const DATA_DIR = path.join(process.cwd(), "api", "data");

export async function getIssueAndData() {
  if (!process.env.GITHUB_ISSUE) {
    // kkrishguptaa/dockyard#123
    throw new Error("GITHUB_ISSUE environment variable is not set.");
  }

  if (!process.env.GITHUB_TOKEN) {
    throw new Error("GITHUB_TOKEN environment variable is not set.");
  }

  const [repository, issueNumber] = process.env.GITHUB_ISSUE.split("#");
  const [owner, repo] = repository.split("/");

  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });

  const issue = await octokit.issues.get({
    owner,
    repo,
    issue_number: parseInt(issueNumber, 10),
  });

  if (!issue.data.body) {
    octokit.issues.createComment({
      owner,
      repo,
      issue_number: parseInt(issueNumber, 10),
      body: "No issue body found. Please provide a valid issue body. Closing the issue.",
    });

    octokit.issues.update({
      owner,
      repo,
      issue_number: parseInt(issueNumber, 10),
      state: "closed",
    });

    process.exit(0);
  }

  if (!fs.existsSync(TEMPLATE)) {
    throw new Error(`Template file not found: ${TEMPLATE}`);
  }

  const template = fs.readFileSync(TEMPLATE, "utf-8");
  if (!template) {
    throw new Error(`Template file is empty: ${TEMPLATE}`);
  }

  const parsedIssue = parseIssue(issue.data.body, template);

  console.log(parsedIssue);

  return {
    issue: issue.data,
    data: parsedIssue,
    zod: issueSchema.parse(parsedIssue),
  };
}

export async function getExistingData(id: string) {
  const filePath = path.join(DATA_DIR, `${id}.json`);
  if (!fs.existsSync(filePath)) {
    return undefined;
  }

  const content = fs.readFileSync(filePath, "utf-8");
  if (!content) {
    return undefined;
  }

  return dataSchema.parse(JSON.parse(content));
}

export async function convertData(data: z.infer<typeof issueSchema>) {
  const parsedData = issueSchema.parse(data);
  const existingData = await getExistingData(parsedData.id);

  return dataSchema.parse({
    name: parsedData.name,
    type: parsedData.type,
    draft: parsedData.draft,
    description: parsedData.description,
    ys: parsedData.ys,
    ws: parsedData.ws,
    extern: {
      website: parsedData.website,
      slack: {
        link: parsedData["slack-link"],
        name: parsedData["slack-name"],
      },
    },
    timeline: parsedData.timeline,
    ships: existingData?.ships || [],
  });
}

export async function createFile(id: string, data: z.infer<typeof dataSchema>) {
  const filePath = path.join(DATA_DIR, `${id}.json`);
  const content = JSON.stringify(data, null, 2) + "\n";

  fs.writeFileSync(filePath, content, "utf-8");

  console.log(`File created at ${filePath}`);
  return filePath;
}

const { zod } = await getIssueAndData();

const { id } = zod;

const convertedData = await convertData(zod);

createFile(id, convertedData);
