import { z } from "zod";

export const UserSchema = z.object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.email("Invalid email address"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
    role: z.enum(["admin", "user"]).default("user"),
});

export type UserType = z.infer<typeof UserSchema>;
