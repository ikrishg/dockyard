export type status = "active" | "inactive";

export const statuses: status[] = ["active", "inactive"];

export interface YSWS {
  name: string;
  status: status;
  description: string;
  website: string;
  slack: string;
  deadline: string;
}
