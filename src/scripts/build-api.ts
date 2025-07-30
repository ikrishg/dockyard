import fs from "fs";
import path from "path";
import { dataSchema } from "../utils/data-schema";
import { apiSchema } from "../utils/api-schema";

function makeAPIData(id: string, content: string) {
  const data = dataSchema.parse(content);

  const currentTimeline = data.timeline.reduce((prev, curr) => {
    const prevStart = new Date(prev.start).getTime();
    const currStart = new Date(curr.start).getTime();
    return currStart > prevStart ? curr : prev;
  }, data.timeline[0]);

  const active =
    new Date(currentTimeline.start) <= new Date() &&
    new Date(currentTimeline.end) >= new Date();

  return apiSchema.element.parse({
    name: data.name,
    id,
    status: active,
    type: data.type,
    draft: data.draft,
    description: data.description,
    ys: data.ys,
    ws: data.ws,
    extern: data.extern,
    start: currentTimeline.start,
    end: currentTimeline.end,
  });
}

const yswsDir = path.join(process.cwd(), "api", "data");

const files = fs
  .readdirSync(yswsDir)
  .filter((file) => file.endsWith(".json"))
  .map((file) => file.replace(".json", ""));

const ysws = files
  .map((file) => {
    const filePath = path.join(yswsDir, `${file}.json`);
    const content = fs.readFileSync(filePath, "utf-8");

    console.log(`Making data for ${file}.json...`);

    return makeAPIData(file, JSON.parse(content));
  })
  .filter((data) => data.draft === false)
  .sort((a, b) => {
    if (a.status === b.status) {
      return new Date(b.end).getTime() - new Date(a.end).getTime();
    }

    return a.status === "active" ? -1 : 1; // Active programs first
  });

const apiFilePath = path.join(process.cwd(), "api", "data.json");

fs.writeFileSync(apiFilePath, JSON.stringify(ysws, null, 2) + "\n", "utf-8");

console.log(`API file created at ${apiFilePath}`);
