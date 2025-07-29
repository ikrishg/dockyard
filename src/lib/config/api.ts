export const apiBaseUrl = new URL("https://dockyard-api.krishg.com");

import { z } from "zod";
import { apiSchema } from "$/utils/api-schema";
import type { dataSchema } from "$/utils/data-schema";

export type DataListElement = z.infer<typeof apiSchema.element>;
export type Status = DataListElement["status"];
export type Type = DataListElement["type"];

export const statuses: Status[] = ["active", "inactive"];
export const types: Type[] = ["flagship", "ysws"];

export type DataItem = z.infer<typeof dataSchema>;
