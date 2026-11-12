import z from "zod/v3";

const numericField = (label, { positive = false } = {}) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .refine((value) => Number.isFinite(Number(value)), `${label} must be a number`)
    .refine(
      (value) => !positive || Number(value) > 0,
      `${label} must be greater than 0`,
    );

export const editProductSchema = z.object({
  category: z.string().trim().min(1, "Please select a category"),
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .min(3, "Title must be at least 3 characters"),
  description: z.string().trim().min(1, "Description is required"),
  price: numericField("Price", { positive: true }),
  discount: numericField("Discount"),
  stock: numericField("Stock"),
  About: z.string().trim().min(1, "About is required"),
});
