export type Status = "active" | "inactive";
export type Type = "flagship" | "ysws";

export const statuses: Status[] = ["active", "inactive"];
export const types: Type[] = ["flagship", "ysws"];

export interface YSWS {
  name: string;
  id: string;
  status: Status;
  type: Type;
  draft: boolean;
  description: string;
  ys: string;
  ws: string;
  extern: {
    website: string | null;
    slack: {
      link: string;
      name: string;
    };
  };
  start: string;
  end: string;
}
