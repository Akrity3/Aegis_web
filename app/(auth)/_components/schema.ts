import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(1, "First name is required"),
    lastName: z
      .string()
      .trim()
      .min(1, "Last name is required"),
    username: z
      .string()
      .trim()
      .min(3, "Username must be at least 3 characters"),
    email: z
      .string()
      .trim()
      .email("Enter a valid email address"),
    phoneNumber: z
      .string()
      .trim()
      .min(7, "Phone number is required")
      .regex(/^\+?[\d\s\-()]{7,15}$/, "Enter a valid phone number"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    agreed: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;