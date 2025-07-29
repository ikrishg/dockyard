import { dataSchema } from "$/utils/data-schema";
import { z } from "zod";

export const gitHubIssueBaseUrl = new URL(
  "https://github.com/kkrishguptaa/dockyard/issues/new?template=gh-automator.yaml"
);

export const issueSchema = z.object({
  id: z.string().min(1, "Program slug is required"),
  name: dataSchema.shape.name.min(1, "Program name is required"),
  type: z.array(dataSchema.shape.type).transform((v) => v[0]),
  draft: z.array(dataSchema.shape.draft).transform((v) => v[0]),
  description: dataSchema.shape.description.min(1, "Description is required"),
  ys: dataSchema.shape.ys.min(1, "YS is required"),
  ws: dataSchema.shape.ws.min(1, "WS is required"),
  website: dataSchema.shape.extern.shape.website.optional().default(null),
  "slack-link": dataSchema.shape.extern.shape.slack.shape.link,
  "slack-name": dataSchema.shape.extern.shape.slack.shape.name,
  timeline: dataSchema.shape.timeline,
  ships: dataSchema.shape.ships,
});

export type IssueData = z.infer<typeof issueSchema>;
