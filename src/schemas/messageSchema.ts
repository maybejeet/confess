import { z } from "zod";

export const messageSchema = z.object({
    content: z.string().min(10, {message: "content must be atleast of 10 characters"}).max(400, "content must be less than 400 characters")
})