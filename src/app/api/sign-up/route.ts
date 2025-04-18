
import dbConnect from "@/lib/dbConnect";
import bcrypt from "bcryptjs";
import UserModel from "@/models/users.model";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { NextResponse } from "next/server";


export async function POST(request: Request): Promise<NextResponse>{
    await dbConnect();
    try {
        const {username , email , password} = await request.json()

        //check if that username already exists and also if that isVerified
        const existingUserVerifiedByUsername = await UserModel.findOne({username, isVerified:true})
        if(existingUserVerifiedByUsername){
            
            return NextResponse.json({
                success: false,
                message: "Username already taken",
            }, { status:400 })
        }
        
        const existingUserByEmail = await UserModel.findOne({email})
        const verifyCode = Math.floor(100000 + Math.random()*900000).toString()
        if(existingUserByEmail){
            if(existingUserByEmail.isVerified){
                return NextResponse.json({
                    success: false,
                    message: "This email already exists",
                }, { status:500 })
            } else {
                const hashedPassword = await bcrypt.hash(password, 12)
                existingUserByEmail.password = hashedPassword
                existingUserByEmail.verifyCode = verifyCode
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)

                await existingUserByEmail.save()
            }
        }else{
            const hashedPassword = await bcrypt.hash(password, 12)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1 )

            const newUser = new UserModel({
                username: username,
                email: email,
                password: hashedPassword,
                verifyCode: verifyCode,
                verifyCodeExpiry: expiryDate,
                isAcceptingMessages: true,
                isVerified: false,
                messages: []
            })
            await newUser.save()
        }
        
        
        //send verification email
        const emailResponse =  await sendVerificationEmail(email, username , verifyCode)     
        if(!emailResponse.success){
                return NextResponse.json({
                    success: false,
                    message: "Email response error",
                }, { status:500 })
            }
            console.log("Email response" , emailResponse);
            console.log(`username = ${username} , email = ${email}`);
            
        return NextResponse.json({
            success: true,
            message: "User registered successfully. Please verify your email",
            
        } , {status: 201})

    } catch (error) {
        console.error("Error signing up", error);
        return NextResponse.json({
            success: false,
            message: "Error signing up",
        } , { status: 500 })
    }
}