import z from "zod";

export const SignupSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(1),
});

export const SigninSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
})

export const ContentSchema = z.object({
    title: z.string().min(1),
    link: z.string().url(),
    tags: z.array(z.string()).min(1).optional()
})


