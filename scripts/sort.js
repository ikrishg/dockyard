// Sorts the API JSON file by ending date.

import json from "../static/api.json";
import fs from "fs";
import path from "path";

const sorted = json.sort((a, b) => {
  const dateA = new Date(a.deadline);
  const dateB = new Date(b.deadline);

  return dateA - dateB;
});

const sortedJson = JSON.stringify(sorted, null, 2);
const filePath = path.join(process.cwd(), "static", "api.json");

fs.writeFileSync(filePath, sortedJson, "utf8");
