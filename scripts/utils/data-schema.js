import zod from "zod";

const DateString = zod.string().refine((val) => !isNaN(Date.parse(val)), {
  message: "Invalid date format",
});

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
      link: zod.url(),
      name: zod.string(),
    }),
  }),
  timeline: zod.array(
    zod.object({
      start: DateString,
      end: DateString,
    })
  ),
});

export { dataSchema };
