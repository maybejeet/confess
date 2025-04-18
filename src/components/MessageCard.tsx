"use client";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Message } from "@/models/users.model";
import { ApiResponse } from "@/types/ApiResponse";
import axios from "axios";
import { X } from "lucide-react";
import { toast } from "sonner";
import dayjs from 'dayjs'


type MessageCardProps = {
  message : Message;
  onMessageDelete : (messageId : string) => void
}

const MessageCard = ({message , onMessageDelete} : MessageCardProps ) => {

  const handleMessageDelete = async () => {

    try {
      const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
      toast.success("Message deleted",{
        description: response.data.message
      })
      onMessageDelete(message._id as string)
    } catch (error) {
      toast.error("Message couldn't be deleted. Try again")
      console.log("Error deleting message" , error);
      
  }}

  return (
    <div className="m-3">
    <Card className="w-[400px] sm:w-[560px] flex ">
    <CardHeader>
      <CardTitle><p>{message.content}</p></CardTitle>
      <CardDescription> <p>{dayjs(message.createdAt).format('DD MMM YYYY, h:mm A')}</p></CardDescription>
    </CardHeader>
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="mr-2"><X/></Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this message.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleMessageDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </Card>
  </div>
  )
  }

export default MessageCard