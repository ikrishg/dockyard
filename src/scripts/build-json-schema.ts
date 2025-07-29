import fs from "fs";
import path from "path";
import { z } from "zod";
import { dataSchema } from "../utils/data-schema";

const dataJSONSchema = z.toJSONSchema(dataSchema);

const file = path.join(process.cwd(), "api", "data.schema.json");

fs.writeFileSync(file, JSON.stringify(dataJSONSchema, null, 2) + "\n", "utf-8");
