import { z } from "zod";

export const passwordSchema  = z.object({
    code: z.string().length(6, "Password code must be of 6 digit")
})