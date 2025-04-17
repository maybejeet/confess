import { z } from "zod";
import { usernameValidation } from "./signUpSchema";

export const signInSchema  = z.object({
        username: usernameValidation,
        password: z.string()
})