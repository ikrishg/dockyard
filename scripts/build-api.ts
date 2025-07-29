//@ts-check
import fs from "fs";
import path from "path";
import { dataSchema } from "./utils/data-schema";

/**
 *
 * @param {string} id
 * @param {string} content
 * @returns {import('../src/lib/config/ysws').YSWS}
 */
function makeAPIData(id, content) {
  const data = dataSchema.parse(content);

  const currentTimeline = data.timeline.sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
  )[0];

  const active =
    new Date(currentTimeline.start) <= new Date() &&
    new Date(currentTimeline.end) >= new Date();

  return {
    name: data.name,
    id,
    status: active ? "active" : "inactive",
    type: data.type,
    draft: data.draft,
    description: data.description,
    ys: data.ys,
    ws: data.ws,
    extern: data.extern,
    start: currentTimeline.start,
    end: currentTimeline.end,
  };
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
  .sort((a, b) => {
    return new Date(a.start).getTime() - new Date(b.start).getTime();
  });

const apiFilePath = path.join(process.cwd(), "api", "data.json");

fs.writeFileSync(apiFilePath, JSON.stringify(ysws, null, 2) + "\n", "utf-8");

console.log(`API file created at ${apiFilePath}`);
