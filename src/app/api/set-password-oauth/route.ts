import UserModel from "@/models/users.model";
import dbConnect from "@/lib/dbConnect";

export async function POST(request : Request) {
try {
    await dbConnect();
    const {username , password  , verifyPassword } = await request.json()
    const decodedUsername = decodeURIComponent(username)
    const user = await UserModel.findOne({username : decodedUsername})
    if(!user){
        return Response.json({
            message: "User not found ",
            status: 400,
            success: false
        })
    } 
    if(password != verifyPassword){
        return Response.json({
            message: "Password did not match",
            status: 400,
            success: false
        })
    }
    user.password = password
    await user.save()
    
    return Response.json({
        message: "Password updated",
        status: 200,
        success: true
    })
    } catch (error) {
    console.log("Error while verifying code" , error)
    return Response.json({
        message: "Error while verifying code ",
        success: false},{
        status: 400,
    })
}

}