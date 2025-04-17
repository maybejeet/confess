import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/users.model";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import { NextRequest } from "next/server";



  
export async function DELETE(request: NextRequest ,   { params }: { params: Promise<{ messageid: string }> }){

    const {messageid} = await params
    await dbConnect();

    const session = await getServerSession(authOptions)
    const user : User = session?.user as User
    if(!session || !user){
        return Response.json({
            success:false,
            message: "Not authenticated"
        }, { status: 401 })
    }

    try {
       const updatedResult = await UserModel.updateOne( {_id : user._id} , { $pull: { messages: {_id : messageid} } } )

       if(updatedResult.modifiedCount == 0){
        return Response.json({
            success:false,
            message: "Message not found or already deleted"
        }, { status: 401 })
       }

       return Response.json({
        success:false,
        message: "Message deleted successfully"
    }, { status: 201 })

        
    } catch (error) {
        console.log("Error deleting message", error);
        
        return Response.json({
            success:false,
            message: "Error deleting message"
        }, { status: 401 })
    }
}



