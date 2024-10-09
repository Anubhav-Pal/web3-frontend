export type Task = {
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed";
  dueDate: Date;
  _id: string;
};
