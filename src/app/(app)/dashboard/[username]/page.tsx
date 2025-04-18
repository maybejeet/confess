
"use client";

import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Message } from "@/models/users.model";
import { acceptingMessageSchema } from "@/schemas/acceptingMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from 'zod'



const Page = () => {
  const [messages , setMessages] = useState<Message[]>([])
  const [isLoading , setIsLoading] = useState(false)
  const [isSwitchLoading , setIsSwitchLoading] = useState(false)

  const form = useForm<z.infer <typeof acceptingMessageSchema>>({
    resolver: zodResolver(acceptingMessageSchema)
  })

  const {data:session} = useSession()
  const params = useParams()
  const {register , watch , setValue} = form
  const acceptMessages = watch('acceptMessage')

  const handleDeleteMessage = (messageId : string) => {
    setMessages(messages.filter((message) => message._id != messageId))
  }

  const fetchAcceptMessage = useCallback(async ()=> {
    setIsSwitchLoading(true)
    try {
      const response = await axios.get('/api/accept-message')
      console.log("Response of dashboard" , response);
      setValue("acceptMessage", response.data?.isAcceptingMessages)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast("Oops!!",{
        description: axiosError.response?.data.message
      })
    } finally {
      setIsLoading(false)
    }
  },[setValue])

  const fetchAllMessages = useCallback( async (refresh : boolean = false) => {
    setIsLoading(true)
    setIsSwitchLoading(false)

    try {
     const response =  await axios.get<ApiResponse>(`/api/get-messages`)
     setMessages(response.data.messages || [])
     if(refresh){
      toast("Showing latest messages")
     }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error("Error",{
        description: axiosError.response?.data.message
      })
    } finally {
      setIsLoading(false)
      setIsSwitchLoading(false)
    }
  }, [setIsLoading , setIsSwitchLoading])

  useEffect(() => {
    if(!session || !session.user) return
    fetchAllMessages()
    fetchAcceptMessage()
  } , [session , setValue , fetchAcceptMessage , fetchAllMessages])

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>(`/api/accept-message`,{
        acceptMessage: !acceptMessages
      })
      setValue('acceptMessage', !acceptMessages)
      
      
      toast(response.data.message)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error("Error",{
        description: axiosError.response?.data.message
      })
    }
  }

  const {username} = params

  const baseUrl = `${window.location.protocol}//${window.location.host}`
  const profileUrl = `${baseUrl}/u/${username}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl)
    toast("Url copied to clipboard")
  }

  if(!session || !session.user){
    <div className="pr-[10%] pl-[10%] pt-[5%] text-center text-2xl">Please Login</div>
  }
  
  return (
    <div className="pr-[10%] pl-[10%] pt-[5%]">
      <h1 className="text-4xl font-bold mb-3">
        User Dashboard
      </h1>

      <div>
        <h2 className="mb-2 font-bold">
        Copy Your Unique Link
        </h2>
        <div className="flex justify-between bg-gray-100 p-2 rounded-2xl items-center">
          <Input
          className="font-semibold"
          type="text"
          value={profileUrl}
          disabled
          />
          <Button onClick={copyToClipboard}> Copy </Button>
        </div>
      </div>
      <div className="flex items-center space-x-2 mt-5 mb-5">
      <Switch 
      {...register('acceptMessage')}
      checked={acceptMessages}
      onCheckedChange={handleSwitchChange}
      disabled={isSwitchLoading}
      
      />
      <Label className="text-[18px]">Accept Messages: {acceptMessages ? <>On</>:<>Off</>}</Label>
    </div>
    <Separator/>
    <Button className="mt-4" onClick={(e) => {e.preventDefault(); fetchAllMessages(true)}}>
      {isLoading ? <Loader2 className="animate-spin"/> : <RefreshCcw/>}
    </Button>

    <div className="sm:flex sm:flex-wrap mt-5  ">
      {messages.length > 0 ? 
      (messages.map((message, index) => (
        <MessageCard
        key={index}
        message={message}
        onMessageDelete={handleDeleteMessage}
        />
      )))
      : <p>No messages to dispaly</p>
    } 
    </div>

    </div>
  )
}

export default Page