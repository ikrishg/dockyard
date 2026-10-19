import { dataSchema } from "$/utils/data-schema";
import { z } from "zod";

export const gitHubIssueBaseUrl = new URL(
  "https://github.com/ikrishg/dockyard/issues/new?template=gh-automator.yaml"
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

/** Format timeline entries for the gh-automator issue `timeline` query param. */
export function formatIssueTimeline(
  timeline: IssueData["timeline"],
  timezone: string
): IssueData["timeline"] {
  return timeline.map((entry) => {
    let start = entry.start;
    let end = entry.end;

    if (!start.includes("T")) {
      start = `${start}T00:00:00${timezone}`;
    } else {
      start = `${start}:00${timezone}`;
    }
    if (!end.includes("T")) {
      end = `${end}T23:59:59${timezone}`;
    } else {
      end = `${end}:59${timezone}`;
    }
    return { start, end };
  });
}

/**
 * Build a GitHub new-issue URL with query params that match
 * `.github/ISSUE_TEMPLATE/gh-automator.yaml` field ids and dropdown option values.
 */
export function buildGitHubIssuePrefillUrl(
  data: IssueData,
  timezone: string
): string {
  const url = new URL(gitHubIssueBaseUrl.toString());

  if (data.id.length > 0) {
    url.searchParams.set("id", data.id);
  } else {
    url.searchParams.set(
      "id",
      data.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase()
    );
  }

  url.searchParams.set("name", data.name);
  url.searchParams.set("draft", data.draft ? "true" : "false");
  url.searchParams.set("type", data.type);
  url.searchParams.set("description", data.description);
  url.searchParams.set("ys", data.ys);
  url.searchParams.set("ws", data.ws);
  url.searchParams.set("slack-link", data["slack-link"]);
  url.searchParams.set("slack-name", data["slack-name"]);
  url.searchParams.set("website", data.website ?? "");

  url.searchParams.set(
    "timeline",
    JSON.stringify(formatIssueTimeline(data.timeline, timezone))
  );

  return url.toString();
}
