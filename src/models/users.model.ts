import mongoose,{Schema , Document} from "mongoose";


export interface Message extends Document {
    content: string
    createdAt: Date
}

const messageSchema : Schema<Message> = new Schema({
    content: {
        type: String,
        required: true,
    },
    createdAt:{
        type: Date,
        required: true,
        default: Date.now
    }
})

export interface User extends Document{
    username: string
    email: string
    password: string
    verifyCode: string
    verifyCodeExpiry?: Date
    isAcceptingMessages: boolean
    isVerified: boolean
    messages: Message[]
}
const userSchema : Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        unique: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please Enter a vaild email" ]
    },
    password: {
        type: String,
       // required: [true, "Password is required"],
        trim: true,
        unique: true
    },
    verifyCode: {
        type: String,
        //required: [true, "Verify code is required"],
        trim: true,
        unique: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verifyCodeExpiry:{
        type: Date,
       // required: [true, "Verify code is required"]  
    },
    isAcceptingMessages: {
        type: Boolean,
        default: true
    },
    messages: [messageSchema]
})

const UserModel = (mongoose.models.User as mongoose.Model<User>)  ||  mongoose.model<User>("User", userSchema)
// const MessageModel = (mongoose.models.Message as mongoose.Model<Message>) || mongoose.model<Message>("Message" , messageSchema)

export default UserModel
// export default MessageModel