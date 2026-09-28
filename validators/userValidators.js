import {z} from "zod";
export const signupSchema=z.object({
    name:z.string().trim().min(3,"Minimum lentgh should be 3").max(40,"Maximum lentgh should be 40"),
    age:z.number().min(10,"Minimum age should be 10").max(100,"Maximum age should be 100").optional(),
    email:z.preprocess((value)=>{return typeof value==="string"?value.trim().toLowerCase():""
    },z.email("Email must be valid")),
password: z.string()
  .min(8, "Password must be at least 8 characters")
  .max(15, "Password must be at most 15 characters")
  .regex(/[A-Z]/, "Must contain an uppercase letter")
  .regex(/[a-z]/, "Must contain a lowercase letter")
  .regex(/[0-9]/, "Must contain a digit")
  .regex(/[^A-Za-z0-9]/, "Must contain a special character")
});

export const loginSchema=z.object({
   email:z.preprocess((value)=>{return typeof value==="string"?value.trim().toLowerCase():""
    },z.email("Email must be valid")),
    password: z.string()
  .min(8, "Password must be at least 8 characters")
  .max(15, "Password must be at most 15 characters")
  .regex(/[A-Z]/, "Must contain an uppercase letter")
  .regex(/[a-z]/, "Must contain a lowercase letter")
  .regex(/[0-9]/, "Must contain a digit")
  .regex(/[^A-Za-z0-9]/, "Must contain a special character")
})