const z = require("zod");
console.log(z);

exports.signupSchema = z.object({
  name: z
    .string({ required_error: "Name is required!" })
    .trim()
    .min(5, "Name must be at least 5 characters"),
  email: z
    .string({ required_error: "Email is required!" })
    .trim()
    .email("Please provide a valid email")
    .toLowerCase(),
  password: z
    .string({ require_error: "Passord is required" })
    .min(6, "Password must be at least 6 characters")
    .max(24, "Password is too long"),
});

exports.signinSchema = z.object({
  email: z
    .string({ required_error: "Email is required!" })
    .trim()
    .email("Please provide a valid email")
    .toLowerCase(),
  password: z
    .string({ require_error: "Passord is required" })
    .min(6, "Password must be at least 6 characters")
    .max(24, "Password is too long"),
});

exports.editUserSchema = z.object({
  name: z
    .string({ required_error: "Name is required!" })
    .trim()
    .min(5, "Name must be at least 5 characters"),
  email: z
    .string({ required_error: "Email is required!" })
    .trim()
    .email("Please provide a valid email")
    .toLowerCase(),
});

exports.editPasswordSchema = z.object({
  password: z
    .string({ require_error: "Passord is required" })
    .min(6, "Password must be at least 6 characters")
    .max(24, "Password is too long"),
});
