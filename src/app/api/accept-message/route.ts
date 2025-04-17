
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/authOptions";
import UserModel from "@/models/users.model";
import dbConnect from "@/lib/dbConnect";

import mongoose from "mongoose";


export async function POST(request : Request){
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user = session?.user
    if(!session || !user){
        return Response.json({
            success:false,
            message: "User not found"
        }, { status: 401 })
    }
    //const userId = user?._id
    const userId = new mongoose.Types.ObjectId(user?._id)
    try {
        const {acceptMessage} = await request.json()
        const updatedUser = await UserModel.findByIdAndUpdate( userId , {isAcceptingMessages: acceptMessage}, {new:true})
        if(!updatedUser){
            return Response.json({
                success:false,
                message: "The updated user not found"
            }, { status: 401 }) 
        }
        return Response.json({
            success:true,
            message: "User updated with accept message status",
            updatedUser
        }, { status: 201 })


    } catch (error) {
        console.log("Error updating the accept message", error);
        return Response.json({
            success:false,
            message: "Error updating the accept message"
        }, { status: 501 })
    }
}

export async function GET(){
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user = session?.user
    if(!session || !user){
        return Response.json({
            success:false,
            message: "User not authenticated"
        }, { status: 401 })
    }
    const userId = user?._id
    try {
        const foundUser = await UserModel.findById(userId)
        if(!foundUser){
            return Response.json({
                success:false,
                message: "User not found"
            }, { status: 401 }) 
        }
        return Response.json({
            success:true,
            message: "User found successfully",
            isAcceptingMessages: foundUser.isAcceptingMessages
        }, { status: 200 })


    } catch (error) {
        console.log("Failed to get user status to accept mesage", error);
        return Response.json({
            success:false,
            message: "Failed to update user status to accept mesage"
        }, { status: 501 })
    }
}
