import { dataSchema } from "$/utils/data-schema";
import { z } from "zod";

export const gitHubIssueBaseUrl = new URL(
  "https://github.com/kkrishguptaa/dockyard/issues/new?template=gh-automator.yaml"
);

export const issueSchema = z.object({
  id: z.string().min(1, "Program slug is required"),
  name: dataSchema.shape.name.min(1, "Program name is required"),

  type: z
    .union([dataSchema.shape.type, z.array(dataSchema.shape.type)])
    .transform((v) => (Array.isArray(v) ? v[0] : v)),

  draft: z
    .union([
      dataSchema.shape.draft,
      z.boolean(),
      z.array(z.union([z.boolean(), z.string()])),
    ])
    .transform((v) => {
      if (typeof v === "boolean") return v;
      if (typeof v === "string")
        return dataSchema.shape.draft.parse(v === "true");

      const first = Array.isArray(v) ? v[0] : v;

      return typeof first === "boolean"
        ? first
        : dataSchema.shape.draft.parse(first === "true");
    }),

  description: dataSchema.shape.description.min(1, "Description is required"),
  ys: dataSchema.shape.ys.min(1, "YS is required"),
  ws: dataSchema.shape.ws.min(1, "WS is required"),
  website: dataSchema.shape.extern.shape.website.optional().default(null),
  "slack-link": dataSchema.shape.extern.shape.slack.shape.link,
  "slack-name": dataSchema.shape.extern.shape.slack.shape.name,

  timeline: z.union([z.string(), dataSchema.shape.timeline]).transform((v) => {
    const arr = typeof v === "string" ? JSON.parse(v) : v;
    return dataSchema.shape.timeline.parse(arr);
  }),
});

export type IssueData = z.infer<typeof issueSchema>;
