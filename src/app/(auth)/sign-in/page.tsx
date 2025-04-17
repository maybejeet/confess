"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signInSchema } from "@/schemas/signInSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z  from "zod";



export default function Component() {

    const [isSubmitting , setIsSubmitting] = useState(false)
      const router = useRouter()
    
    const form = useForm<z.infer <typeof signInSchema>>({
      resolver: zodResolver(signInSchema),
      defaultValues: {
        username:'',
        password:''
      }
    })
    
    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
      setIsSubmitting(true)
      try {
        const response = await signIn('credentials', {
          username: data.username,
          password: data.password,
          redirect: false, // don't auto-redirect
        });
        //console.log(response)
        if(response?.error){
        toast.error(response.error)
        }  
        if(response?.url){
          toast.success("Signed in successfully")
          router.replace(`/dashboard/${data.username}`)
        }      
        setIsSubmitting(false)
      } catch (error) {
        console.error("Error in user signin" , error)
              setIsSubmitting(false)
      }
    }
    const copyUsername = () => {
      navigator.clipboard.writeText("jeet")
      toast("Username copied to clipboard")
    }
    const copyPassword = () => {
      navigator.clipboard.writeText("111111")
      toast("Password copied to clipboard")
    }
  return (
    <div className=" min-h-screen border-2 border-black flex text-center justify-center items-center bg-gray-100 flex-col">
      <div className="border-1 rounded-2xl border-black p-7">
        <h1 className="text-6xl font-bold font-sans">Confess Your <br /> Confession</h1>
        <p className="mt-4 mb-7 text-xl">Sign in to start your anonymous adventure</p>
  
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 m-2 ">
          <FormField
            name="username"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">Username</FormLabel>
                <FormControl>
                  <Input placeholder="username" 
                  {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="password"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="password" 
                  {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isSubmitting}>
            {
              isSubmitting ? 
              <>
              <Loader2 className="animate-spin"/> Signing in
              </>: "Sign In"
            }
            
          </Button>
        </form>
      </Form>   
      <div className="text-center mt-4">
      <p>
      Create an account{' '}
      <Link href={"/sign-up"} className="text-blue-600 hover:text-blue-800">Sign up</Link>
      </p>
    </div>  
      </div>
      <div>
        <p className="text-red-500">Test credentials <br /> (click to copy)</p>
        <Button className="m-2" onClick={copyUsername}>Username</Button>
        <Button className="m-2" onClick={copyPassword}>Password</Button>
      </div>
    </div>
    )
}