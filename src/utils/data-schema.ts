import { z } from "zod";

const DateString = z.string().refine((val) => !isNaN(Date.parse(val)), {
  message: "Invalid date format",
});

const dataSchema = z.object({
  name: z.string().describe("The name of the program."),
  type: z
    .enum(["flagship", "ysws"])
    .describe(
      "The type of the program. 'flagship' for flagship programs, 'ysws' for YSWS programs."
    ),
  draft: z
    .boolean()
    .or(
      z.enum(["true", "false"]).transform((v) => (v === "true" ? true : false))
    )
    .describe(
      "Whether the program is in draft mode. If true, it will not be displayed on the website."
    ),
  description: z
    .string()
    .describe("A brief tagline or description of the program."),
  ys: z
    .string()
    .describe("The YS (Your Ship) of the program, which is the work or input."),
  ws: z
    .string()
    .describe(
      "The WS (We Ship) of the program, which is the reward or outcome."
    ),
  extern: z.object({
    website: z
      .url()
      .or(z.null())
      .describe(
        "The website link for the program. Can be null if not applicable."
      ),
    slack: z
      .object({
        link: z
          .url()
          .describe(
            "The Slack link for the program. This is the link to the channel."
          ),
        name: z.string().describe("Slack channel name without the # prefix."),
      })
      .describe("The Slack link and name for the program."),
  }),
  timeline: z
    .array(
      z.object({
        start: DateString,
        end: DateString,
      })
    )
    .min(1, "At least one timeline is required")
    .describe(
      "The timelines of the program, with start and end dates. Used in a chart to display the timelines of all YSWS."
    ),
  ships: z
    .array(
      z.object({
        name: z.string(),
        description: z.string(),
        url: z.url(),
        image: z.url().describe("Will be used in a masonry grid."),
      })
    )
    .default([])
    .describe(
      "An array of ships associated with the program. Each ship has a name, description, URL, and image."
    ),
});

export { dataSchema };
