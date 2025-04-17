import {resend} from "@/lib/resend"
import VerificationEmail from "../../emails/VerificationEmail"
import { ApiResponse } from "@/types/ApiResponse"

export async function sendVerificationEmail(email:string , username: string , verifyCode:string):Promise<ApiResponse>{
    try {
        await resend.emails.send({
            from: 'confessions.example.com',
            to: email,
            subject: 'Email verication for confessions',
            react: VerificationEmail({username , otp:verifyCode}),
          });

        return {
            status: 200,
            success:true,
            message:"Email verification sent"
        }
        
    } catch (error) {
        console.error("Error sending verification email", error);
        return {
            status: 500,
            success:false,
            message:"Error sending verification email"
        }
        
    }
}