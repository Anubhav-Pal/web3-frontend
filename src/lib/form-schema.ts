import { z } from "zod";

export const createEditTaskSchema = z.object({
  title: z.string().min(2, {
    message: "title is required and must be at least 2 characters.",
  }),
  description: z.string().optional(),
  status: z.string(),
  dueDate: z.date().optional(),
  priority: z.string().optional(),
});
