import { convertData, createFile, getIssueAndData } from "./utils/gh-automator";

const { zod } = await getIssueAndData("new-program");

const { id } = zod;

const convertedData = await convertData(zod);

createFile(id, convertedData);
