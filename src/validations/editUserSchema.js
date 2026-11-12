import z from "zod/v3";

export const editUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .min(3, "Name must be at least 3 characters"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Invalid email address"),
  role: z.enum(["2001", "1995", "1999"], {
    errorMap: () => ({ message: "Please select a valid role" }),
  }),
});
