"use client"
import * as z  from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceCallback } from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios, {AxiosError} from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {Loader2} from "lucide-react"


function SignupPage(){
  const [username, setUsername] = useState("")
  const [usernameMessage , setUsernameMessage] = useState('')
  const [isCheckingUsername , setIsCheckingUsername] = useState(false)
  const [isSubmitting , setIsSubmitting] = useState(false)
  // const [debouncedUsername, setDebouncedUsername] = useDebounceValue(username, 500)
  const debounced = useDebounceCallback(setUsername, 500)
  // toast("Event has been created.")
  const router = useRouter()

  //zod implementation
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username:'',
      email:"",
      password:''
    }
  })

  useEffect(()=>{
    const checkUsernameUnique = async () => {
      if(username){
        setIsCheckingUsername(true)
        setUsernameMessage("")

        try {
          const response = await axios.get(`/api/check-username-unique?username=${username}`)
          setUsernameMessage(response.data.message)
          console.log("Response of axios", response);
          console.log(response.data.message)
          
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(axiosError.response?.data.message ?? "Error checking username")
        } finally {
          setIsCheckingUsername(false)
        }
      }
    }
    checkUsernameUnique();
  }, [username])

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true)
    try {
      const response = await axios.post(`/api/sign-up`, data)
      toast.success("Signed up successfully", {
        description: response.data.message,
      })
      router.replace(`/verify/${username}`)
      setIsSubmitting(false)
    } catch (error) {
      console.error("Error in user signup")
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message
      toast.error("Sign up failed",{
        description: errorMessage, 
      })
      setIsSubmitting(false)
    }
  }

  return (
  <div className=" min-h-screen border-2 border-black flex text-center justify-center items-center bg-gray-100">
    <div className="border-1 rounded-2xl border-black p-7">
      <h1 className="text-6xl font-bold font-sans">Confess Your <br /> Confession</h1>
      <p className="mt-4 mb-7 text-xl">Sign up to start your anonymous adventure</p>

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
                onChange={(e) => {
                  field.onChange(e)
                  debounced(e.target.value)}}
                />
              </FormControl>
              <div className="flex justify-start">
                {isCheckingUsername && <Loader2 className=" animate-spin"/>}
                <p className={`text-sm ${usernameMessage === "Username is unique"?"text-green-600":'text-red-600'} ` }> {usernameMessage} </p>
                </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Email</FormLabel>
              <FormControl>
                <Input placeholder="email" 
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
            isSubmitting ? (
              <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
              </>
            ) : ("SignUp")
          }
        </Button>
      </form>
    </Form>
    <div className="text-center mt-4">
      <p>
      Already a member?{' '}
      <Link href={"/sign-in"} className="text-blue-600 hover:text-blue-800">Sign in</Link>
      </p>
    </div>     
    </div>
  </div>
  )
}

export default SignupPage