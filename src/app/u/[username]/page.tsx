"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { messageSchema } from '@/schemas/messageSchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { Copy } from 'lucide-react'


const Page = () => {
  const params = useParams<{username : string}>()
  const username = params.username
  const [isSending , setIsSending] = useState(false)
  const [isSuggestMessageLoading , setIsSuggestMessageLoading] = useState(false)
  const [message , setMessage] = useState([''])
  const [userMessage , setUserMessage] = useState('')

  const form = useForm<z.infer <typeof messageSchema>>({
    resolver: zodResolver(messageSchema)
  })
  const {setValue} = form

  const handleSend = async (data: z.infer<typeof messageSchema>) => {
    setIsSending(true)
    setIsSuggestMessageLoading(false)
    try {
    const response = await axios.post<ApiResponse>(`/api/send-message`, {
      content: data ,
      username
    })
    toast.success("Message sent",{
      description: response.data.message
    })
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse>
    console.log("Error sending message" , axiosError);
    toast.error(axiosError.response?.data.message)
  } finally {
    setIsSending(false)
    setIsSuggestMessageLoading(false)
  }
}
const handleSuggestMessages = async () => {
  setIsSending(false)
  setIsSuggestMessageLoading(true)

  try {
    const response = await axios.post('/api/suggest-messages')
    const generatedTextRaw = response.data.message
    const generatedText = String(generatedTextRaw)
  

    const textArray = generatedText.split("||").filter(msg => msg.trim() !== "")
    setMessage(textArray)
    console.log("Message" , message);
    
    
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse>
    console.log("Error sending message" , axiosError);
    toast.error(axiosError.response?.data.message)
  } finally {
    setIsSending(false)
    setIsSuggestMessageLoading(false)
  }
}
  const handleCopy = (msg : string) => { 
    navigator.clipboard.writeText(msg)
    setUserMessage(msg)
  }
  useEffect(() => {
    if (userMessage.trim() !== "") {
      form.setValue("content", userMessage)
    }
  }, [userMessage , setValue, form])

  return (
    <div className='flex flex-col pr-[10%] pl-[10%] pt-[5%]'>
      <div className='text-center text-4xl font-bold'>Confessions</div>
      <div className='p-8'>
      <p className='font-semibold mb-2'>Send Anonymous Message to @{username}</p>

      <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSend)} className="space-y-8 ">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                {
                  userMessage.trim() != ""  ? <Input placeholder="Write your anonymous message here" value={userMessage} /> : <Input placeholder="Write your anonymous message here" {...field } />
                }
                {/* <Input placeholder="Write your anonymous message here" {...field } /> */}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className='' disabled={isSending}>Submit</Button>
      </form>
    </Form>
    </div>
    <Separator/>
          <div className='mt-6 ml-7 mb-10 '>
          <Button onClick={handleSuggestMessages} disabled={isSuggestMessageLoading}>Suggest Messages</Button>
          </div>
          <div className='w-full  bg-gray-100 rounded-sm '>
          <p className='text-xl font-bold p-6'>Messages</p>
          {message.length === 1 ? 
          <>
            <h1 className='pl-6 p-5 font-semibold'>Click button to get suggested messages</h1>
          </> :
          
          // <div className='w-[80%] flex justify-center flex-col items-center m-auto '> 
          // <Input 
          // value={message[0]}
          // // className='m-6 font-bold text-center'
          // className={cn("m-6 text-center outline-0")}
          // />
          
          // <textarea
          // className="m-6 font-bold text-center"
          // rows={3}
          // value={message[0]}
          // ></textarea>
          // <Input 
          // className='m-6 font-bold text-center'
          // value={message[1]}/>
          // <Input 
          // className='m-6 font-bold text-center'
          // value={message[2]}/>
          // </div>
          <div className="m-2 flex flex-col justify-center items-center">
            <Card className="w-[90%] m-2 flex ">
              <CardHeader>
                <CardTitle><p>{message[0]}</p></CardTitle>
              </CardHeader>
              <Button variant="secondary" className="sm:ml-16 mr-5" onClick={() => handleCopy(message[0])}><Copy/></Button>
            </Card>
            <Card className="w-[90%] m-2 flex ">
              <CardHeader>
                <CardTitle><p>{message[1]}</p></CardTitle>
              </CardHeader>
              <Button variant="secondary" className="sm:ml-16 mr-5"  onClick={() => handleCopy(message[1])}><Copy/></Button>
            </Card>
            <Card className="w-[90%] m-2 flex ">
            <CardHeader>
              <CardTitle><p>{message[2]}</p></CardTitle>
            </CardHeader>
            <Button variant="secondary" className="sm:ml-16 mr-5"  onClick={() => handleCopy(message[2])}><Copy/></Button>
          </Card>
          </div>
          
          }
          </div>
       
 
          <div className='flex m-4 justify-center items-center '>
          <p>Create an account</p>
          <Link href="/sign-up" className="text-blue-600 hover:text-blue-800 pl-3">Sign up</Link>
          </div>
          

      </div>


  )
}

export default Page