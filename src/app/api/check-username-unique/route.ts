import UserModel from "@/models/users.model";
import dbConnect from "@/lib/dbConnect";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";
// import { ApiResponse } from "@/types/ApiResponse";


//make query schema
const usernameQuerySchema = z.object({
    "username" : usernameValidation
})

export async function GET(request : Request) {
    await dbConnect();
    try {
        const {searchParams} = new URL(request.url)
        const queryParams = {
        username : searchParams.get('username')
        }

      //validate with zod
        const result = usernameQuerySchema.safeParse(queryParams)
        console.log("Result of usernameQuerySchema.safeParse(queryParams)" , result)
        if(!result.success){
        const usernameErrors = result.error.format().username?._errors || []
        return Response.json({
            message: usernameErrors?.length > 0 ? usernameErrors.join(',') : "Invalid query parameter",
            status: 400,
            success: false
        })
        }
        const username = result.data?.username
        
        
        const existingVerifiedUser = await UserModel.findOne({username , isVerified: true})   
        //console.log(existingVerifiedUser);
        
        if(existingVerifiedUser){
            return Response.json({
                message: "Username already taken",
                status: 400,
                success: false
            })
        }


        return Response.json({
            message: "Username is unique",
            status: 200,
            success: true
        })
    } catch (error) {
        console.error("Error while checking unique username ",error)
        return Response.json({
            message: "Error while checking unique username ",
            status: 400,
            success: false
        })
    }
}