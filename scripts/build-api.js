import fs from "fs";
import path from "path";

const yswsDir = path.join(process.cwd(), "static", "data");

const files = fs
  .readdirSync(yswsDir)
  .filter((file) => file.endsWith(".json"))
  .map((file) => file.replace(".json", ""));

const ysws = files.map((file) => {
  const filePath = path.join(yswsDir, `${file}.json`);
  const content = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(content);
});

const apiFilePath = path.join(process.cwd(), "static", "api.json");

fs.writeFileSync(apiFilePath, JSON.stringify(ysws, null, 2), "utf-8");

console.log(`API file created at ${apiFilePath}`);
