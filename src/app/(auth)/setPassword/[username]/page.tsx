"use client";
import axios,{AxiosError} from "axios";
import * as z from "zod";
import { useParams, useRouter } from "next/navigation";
import { passwordSchema } from "@/schemas/passwordSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ApiResponse } from "@/types/ApiResponse";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


function SetPassword() {
    const router = useRouter();
    const params = useParams<{username:string}>()

    //zod implementation
    const form = useForm<z.infer<typeof passwordSchema>>({
        resolver: zodResolver(passwordSchema)
    })
    const onSubmit = async (data: z.infer<typeof passwordSchema>) => {
        
        try {
            const response = await axios.post('/api/set-password-oauth', {
                username: params.username,
                code: data.code 
            })
            toast.success("User verified successfully", {
                    description: response.data.message,
                })
            router.replace(`/dashboard/${params.username}`)
        } catch (error) {
            console.error("Error in setting user password")
                const axiosError = error as AxiosError<ApiResponse>;
                const errorMessage = axiosError.response?.data.message
                toast.error("Password set failed",{
                description: errorMessage, 
                })
        }
    }

    return (
        <div className="min-h-screen border-2 border-black flex text-center justify-center items-center bg-gray-100"> 
        <div className="border-1 rounded-2xl border-black p-7">
        <h1 className="sm:text-6xl text-4xl font-bold font-sans">Verify Your <br /> Email</h1>
        <p className="sm:mt-4 sm:mb-7 mt-2 mb-4 sm:text-xl text-[1rem]"> <span className="font-semibold">@{params.username}</span> , enter the veification code sent to your email.</p>

        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 m-2 ">
        <FormField
            name="code"
            control={form.control}
            render={({ field }) => (
            <FormItem>
                <FormLabel className="font-bold">Code</FormLabel>
                <FormControl>
                <Input placeholder="Enter password" 
                {...field} 
                type="password"
                />
                </FormControl>        
                <FormMessage />
            </FormItem>
            )}
        />
         <FormField
            name="code"
            control={form.control}
            render={({ field }) => (
            <FormItem>
                <FormLabel className="font-bold">Code</FormLabel>
                <FormControl>
                <Input placeholder="Verify Password" 
                {...field} 
                type="password"
                />
                </FormControl>        
                <FormMessage />
            </FormItem>
            )}
        />
        <Button type="submit">Verify</Button>
        </form>
    </Form>
        </div>
        </div>
    )
}

export default SetPassword