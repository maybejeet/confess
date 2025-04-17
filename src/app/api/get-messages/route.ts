
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/users.model";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/authOptions";

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
    try {
        const userId = new mongoose.Types.ObjectId(user?._id)
        console.log("User id", userId);
        
        if(userId){
                const user = await UserModel.aggregate([
                    {
                        $match: {_id: userId}
                    },
                    {
                        $unwind:  "$messages"
                    },
                    {
                        $sort: { 'messages.createdAt': -1 }
                    },
                    {
                        $group: { _id: '$_id' , messages: { $push: '$messages' } }
                    }
                ])

                // if(!user || user.length == 0){
                //     return Response.json({
                //         success: false,
                //         message: "User not found",
                //         messages: []
                //     }, { status: 404 }) 
                // }
            
                return Response.json({
                    success: true,
                    message: "Messages fetched",
                    messages: user[0].messages || []
                }, { status: 200 }) 
        } else {
            return Response.json({
                success: false,
                message: "User not found",
                user
            }, { status: 401 }) 
        }
    }
        
    catch (error) {
        console.log("Error getting the user messages" , error);
        
        return Response.json({
            success:false,
            message: "Error getting the user messages"
        }, { status: 501 }) 
    }
}
