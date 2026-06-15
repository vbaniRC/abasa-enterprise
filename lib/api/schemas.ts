import { z } from "zod";

export const roleSchema = z.enum([
  "superadmin",
  "owner",
  "admin",
  "coach",
  "parent",
  "member",
]);

const idSchema = z.string().trim().min(1);
const optionalIdSchema = idSchema.nullish();
const optionalTextSchema = z.string().trim().nullish();

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

export const registerSchema = z.object({
  email: z.string().trim().email(),
});

export const sendEmailSchema = z.object({
  to: z.string().trim().email(),
  subject: z.string().trim().min(1),
  html: z.string().min(1),
});

export const clubIdSchema = z.object({
  clubId: idSchema,
});

export const clubOwnerSchema = z.object({
  clubId: idSchema,
  userId: idSchema,
});

export const clubCreateSchema = z.object({
  name: z.string().trim().min(1),
  description: optionalTextSchema,
});

export const clubUpdateSchema = clubCreateSchema.extend({
  clubId: idSchema,
});

export const userIdSchema = z.object({
  userId: idSchema,
});

const baseUserCreateSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
  full_name: z.string().trim().min(1),
});

export const adminCreateSchema = baseUserCreateSchema;

export const clubUserCreateSchema = baseUserCreateSchema.extend({
  club_id: idSchema,
});

export const memberCreateSchema = clubUserCreateSchema.extend({
  parent_id: optionalIdSchema,
});

export const genericUserCreateSchema = baseUserCreateSchema.extend({
  role: roleSchema,
  club_id: optionalIdSchema,
});

export const updateProfileSchema = z.object({
  full_name: optionalTextSchema,
  avatar_url: optionalTextSchema,
  additional_data: z.unknown().optional(),
});

export const updateRoleSchema = z.object({
  userId: idSchema,
  role: roleSchema,
});

export const updateUserSchema = z.object({
  userId: idSchema,
  full_name: optionalTextSchema,
  avatar_url: optionalTextSchema,
  role: roleSchema,
  club_id: optionalIdSchema,
});
