import { Message } from "@/models/users.model"

export interface ApiResponse{
    status: number
    success: boolean
    message: string
    isAcceptingMessages?: boolean
    messages?: Array<Message>
}