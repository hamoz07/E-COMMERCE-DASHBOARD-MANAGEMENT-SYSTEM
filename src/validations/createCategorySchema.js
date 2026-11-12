import z from "zod/v3";

const imageFile = z.custom(
  (value) =>
    typeof FileList !== "undefined" &&
    value instanceof FileList &&
    value.length > 0 &&
    value[0] instanceof File,
  "Please select a category image",
);

export const createCategorySchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .min(3, "Title must be at least 3 characters"),
  image: imageFile,
});
