"use client";



import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signInSchema } from "@/schemas/signInSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z  from "zod";




export default function Component() {

    const [isSubmitting , setIsSubmitting] = useState(false)
    const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
      const router = useRouter()
      const { data: session, status } = useSession();
    
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
        toast("Signed in successfully")
          router.replace(`/dashboard/${data.username}`)
        }      
        setIsSubmitting(false)
      } catch (error) {
        console.error("Error in user signin" , error)
              setIsSubmitting(false)
      }
    }
    const handleGoogleSignIn = async () => {
      setIsGoogleSubmitting(true);
      try {
        const response = await signIn("google", { redirect: false });
        console.log("Response of google" , response);
        // The redirect will be handled by NextAuth
        if(response?.url){
          router.replace(`/setPassword/${session?.user.username}`)
        }
      // toast("Signed in successfully")
      } catch (error) {
        console.error("Error signing in with Google", error);
        toast.error("Failed to sign in with Google");
      } finally {
        setIsGoogleSubmitting(false);
      }
    }

    // const copyUsername = () => {
    //   navigator.clipboard.writeText("jeet")
    //   toast("Username copied to clipboard")
    // }
    // const copyPassword = () => {
    //   navigator.clipboard.writeText("111111")
    //   toast("Password copied to clipboard")
    // }
    useEffect(() => {
      if (status === "authenticated" && session?.user?.username) {
        // Redirect to the personalized dashboard
        router.replace(`/dashboard/${session.user.username}`);
       toast("Signed in with Google successfully");
      }
    }, [status, session, router]);

    if (status === "authenticated" && session?.user?.username) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="animate-spin mr-2" />
          <p>Redirecting to your dashboard...</p>
        </div>
      );
    }
  return (
    <div className="min-h-screen  flex text-center justify-center items-center bg-gray-100 flex-col">
      <div className="border-1 rounded-2xl border-black p-7">
        <h1 className="sm:text-6xl text-4xl font-bold font-sans">Confess Your <br /> Confession</h1>
        <p className="sm:mt-4 sm:mb-7 mt-2 mb-4 sm:text-xl text-[1rem]">Sign in to start your anonymous adventure</p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 m-2">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Username</FormLabel>
                  <FormControl>
                    <Input placeholder="username" {...field} />
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
                    <Input type="password" placeholder="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 animate-spin" /> Signing in
                </>
              ) : (
                "Sign In with Credentials"
              )}
            </Button>
          </form>
        </Form>

        <div className="mt-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-gray-100 px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
        </div>
              {/* <LoginBtn/> */}
        <Button 
          onClick={handleGoogleSignIn}
          disabled={isGoogleSubmitting}
          className="mt-4 w-full bg-white text-black hover:bg-gray-100 border border-gray-300"
        >
          {isGoogleSubmitting ? (
            <>
              <Loader2 className="mr-2 animate-spin" /> Connecting
            </>
          ) : (
            <>
              <svg className="mr-2 h-4 w-4" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
              </svg>
              Sign in with Google
            </>
          )}
        </Button>

        <div className="text-center mt-4">
          <p>
            Create an account{' '}
            <Link href={"/sign-up"} className="text-blue-600 hover:text-blue-800">Sign up</Link>
          </p>
        </div>
      </div>
      {/* <div>
        <p className="text-red-500">Test credentials <br /> (click to copy)</p>
        <Button className="m-2" onClick={copyUsername}>Username</Button>
        <Button className="m-2" onClick={copyPassword}>Password</Button>
      </div> */}
    </div>
  );
}