import UserModel from "@/models/users.model";
import dbConnect from "@/lib/dbConnect";

export async function POST(request : Request) {
try {
    await dbConnect();
    const {username , code} = await request.json()
    const decodedUsername = decodeURIComponent(username)
    const user = await UserModel.findOne({username : decodedUsername})
    if(!user){
        return Response.json({
            message: "User not found ",
            status: 400,
            success: false
        })
    } 
    const isCodeValid = user.verifyCode === code
    const isCodeNotExpired = new Date(user.verifyCodeExpiry ?? new Date()) > new Date
    

    if(isCodeValid && isCodeNotExpired){
        user.isVerified = true
        await user.save()
        return Response.json({
            message: "Account verified",
            success: true,},{
            status: 200,
        })
    } else if (!isCodeNotExpired){
        return Response.json({
            message: "Code expired please signup again",
            success: true,},{
            status: 400,
        })
    } else {
        return Response.json({
            message: "Incorrect verification code",
            success: true},{
            status: 400,
        })
    }


    
} catch (error) {
    console.log("Error while verifying code" , error)
    return Response.json({
        message: "Error while verifying code ",
        success: false},{
        status: 400,
    })
}

}