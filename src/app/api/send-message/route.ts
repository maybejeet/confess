import dbConnect from "@/lib/dbConnect";
import UserModel, { Message } from "@/models/users.model";


export async function POST(request : Request){
    await dbConnect();
    try {
        
        const {content , username} = await request.json()
        if(!content || !username){
            return Response.json({
                success:false,
                message: "Could not get content or username"
            }, { status: 501 })
        }
        const user = await UserModel.findOne({username})
        
        if(!user){
            return Response.json({
                success:false,
                message: "User not found"
            }, { status: 501 }) 
        }
        if(!user.isAcceptingMessages){
            return Response.json({
                success:true,
                message: "User is not accepting messages",
            }, { status: 400 }) 
        }
        const newMessage = { content: content.content , createdAt: new Date() }
        user.messages.push(newMessage as Message)
        await user.save()
        
        console.log(user);
        return Response.json({
            success:true,
            message: "Message sent",
            newMessage
        }, { status: 200 }) 


    } catch (error) {
        console.log("Error sending messages" , error);  
        return Response.json({
            success:false,
            message: "Error sending messages"
        }, { status: 501 }) 
    }

}