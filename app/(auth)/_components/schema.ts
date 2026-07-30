import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Please provide an email and password")
    .email("Enter a valid email address")
    .refine((email) => email.toLowerCase().endsWith("@gmail.com"), {
      message: "Only Gmail addresses are allowed",
    }),
  password: z.string().min(1, "Please provide an email and password"),
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
      .min(1, "Email is required")
      .email("Enter a valid email address")
      .refine((email) => email.toLowerCase().endsWith("@gmail.com"), {
        message: "Only Gmail addresses are allowed",
      }),
    phoneNumber: z
      .string()
      .trim()
      .regex(/^\d{10}$/, "Phone number must contain 10 digits"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters"),
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