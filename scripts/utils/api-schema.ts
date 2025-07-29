import { z } from "zod";
import { dataSchema } from "./data-schema";

const apiSchema = z.array(
  z.object({
    name: dataSchema.shape.name,
    id: z.string(),
    status: z.boolean().transform((active) => (active ? "active" : "inactive")),
    type: dataSchema.shape.type,
    draft: dataSchema.shape.draft,
    description: dataSchema.shape.description,
    ys: dataSchema.shape.ys,
    ws: dataSchema.shape.ws,
    extern: dataSchema.shape.extern,
    start: dataSchema.shape.timeline.element.shape.start,
    end: dataSchema.shape.timeline.element.shape.end,
  })
);

export { apiSchema };
