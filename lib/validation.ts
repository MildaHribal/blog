import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export const postUpsertSchema = z.object({
  title: z.string().min(3),
  slug: z
    .string()
    .min(3)
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers and hyphens."),
  description: z.string().min(3),
  content: z.string().min(1),
  tags: z.array(z.string().min(1)).default([]),
  author: z.string().min(2).default("Karel"),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
  coverImage: z.string().optional().default(""),
});

export type PostUpsertInput = z.infer<typeof postUpsertSchema>;
