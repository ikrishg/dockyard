import zod from "zod";

const dataSchema = zod.object({
  name: zod.string(),
  type: zod.enum(["flagship", "ysws"]),
  draft: zod.boolean(),
  description: zod.string(),
  ys: zod.string(),
  ws: zod.string(),
  extern: zod.object({
    website: zod.url().or(zod.null()),
    slack: zod.object({
      link: zod.url({ hostname: "hackclub.slack.com" }),
      name: zod.string(),
    }),
  }),
  timeline: zod.array(
    zod.object({
      start: zod.date(),
      end: zod.date(),
    })
  ),
});

export { dataSchema };
