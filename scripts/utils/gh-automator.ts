import { parseIssue } from "@github/issue-parser";
import { Octokit } from "@octokit/rest";
import fs from "fs";
import path from "path";
import { z } from "zod";
import { dataSchema } from "./data-schema";

const TEMPLATES_DIR = path.join(process.cwd(), ".github", "ISSUE_TEMPLATE");

const TEMPLATES = {
  "new-program": path.join(TEMPLATES_DIR, "new-program.yaml"),
  "edit-program": path.join(TEMPLATES_DIR, "edit-program.yaml"),
};

const DATA_DIR = path.join(process.cwd(), "api", "data");

export const issueSchema = z.object({
  id: z.string().min(1, "Program slug is required"),
  name: dataSchema.shape.name.min(1, "Program name is required"),
  type: z.array(dataSchema.shape.type),
  draft: z.array(dataSchema.shape.draft),
  description: dataSchema.shape.description.min(1, "Description is required"),
  ys: dataSchema.shape.ys.min(1, "YS is required"),
  ws: dataSchema.shape.ws.min(1, "WS is required"),
  website: dataSchema.shape.extern.shape.website.optional().default(null),
  "slack-link": dataSchema.shape.extern.shape.slack.shape.link,
  "slack-name": dataSchema.shape.extern.shape.slack.shape.name,
  timeline: dataSchema.shape.timeline,
  ships: dataSchema.shape.ships,
});

export async function getIssueAndData(template: keyof typeof TEMPLATES) {
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

  const templateFile = TEMPLATES[template];
  if (!fs.existsSync(templateFile)) {
    throw new Error(`Template file not found: ${templateFile}`);
  }

  const templateContent = fs.readFileSync(templateFile, "utf-8");
  if (!templateContent) {
    throw new Error(`Template file is empty: ${templateFile}`);
  }

  const parsedIssue = parseIssue(issue.data.body, templateContent);

  console.log(parsedIssue);

  return {
    issue: issue.data,
    data: parsedIssue,
    zod: issueSchema.parse(parsedIssue),
  };
}

export async function convertData(data: z.infer<typeof issueSchema>) {
  const parsedData = issueSchema.parse(data);

  return dataSchema.parse({
    name: parsedData.name,
    type: parsedData.type[0],
    draft: parsedData.draft[0],
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
    ships: parsedData.ships,
  });
}

export async function createFile(id: string, data: z.infer<typeof dataSchema>) {
  const filePath = path.join(DATA_DIR, `${id}.json`);
  const content = JSON.stringify(data, null, 2) + "\n";

  fs.writeFileSync(filePath, content, "utf-8");

  console.log(`File created at ${filePath}`);
  return filePath;
}
