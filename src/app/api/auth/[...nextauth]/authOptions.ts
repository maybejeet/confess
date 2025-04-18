


import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/users.model";
import GoogleProvider from "next-auth/providers/google";





 export const authOptions : NextAuthOptions = {
providers: [
    CredentialsProvider({
        id: "credentials",
        name: "Credentials",
        credentials: {
            // email: { label: "Email", type: "text" },
            username: { label: "Username", type: "text" },
            password: { label: "Password", type: "password" }
        },
        async authorize(credentials : any ): Promise<any> {
            await dbConnect()
            try {
                const user = await UserModel.findOne({
                    $or:[{username: credentials?.username}]
                    // $or:[{email: credentials.identifier},{username: credentials.identifier}]
                })
                
                if(!user){
                throw new Error("No user found")
                //console.log("No user found ");
                
                }
                if(!user.isVerified){
                throw new Error("Please verify your account")

                }
                const isPasswordCorrect = await bcrypt.compare(credentials.password , user.password)
                if(isPasswordCorrect){
                    return user
                } else {
                throw new Error("Incorrect password")
                }

            } catch (error: unknown) {
                if (error instanceof Error) {
                  console.error("Error in authorize:", error.message)
                  throw new Error(error.message)
                } else {
                  throw new Error("Unknown error occurred during authentication")
                }
        }
}}),

GoogleProvider({
    clientId: process.env.GOOGLE_ID!,
    clientSecret: process.env.GOOGLE_SECRET!,
    authorization: { params: { scope: "openid email profile" } },
  }),
], 
callbacks: {
    async signIn({ user, account , profile}) {
        // Only handle Google sign-ins here
        if (account?.provider === "google") {
        await dbConnect();
        try {
              // Check for email
        if (!user.email) {
            console.error("Google did not provide an email address");
            return false;
        }
        
        console.log("Google profile:", profile);
        console.log("Google user:", user);
            let dbUser = await UserModel.findOne({ email: user.email });
            

            if (!dbUser) {
                const baseUsername = user.name?.split(' ')[0].toLowerCase() || '';
                let username = baseUsername;
                let counter = 0;

                while (await UserModel.findOne({ username })) {
                    counter++;
                    username = `${baseUsername}${counter}`;
                    }
                
                    try {
                        dbUser = await UserModel.create({
                        email: user.email,
                        name: user.name || username,
                        username: username,
                        isVerified: true, // Auto-verify Google users
                        isAcceptingMessages: true,
                        // No password needed for OAuth users
                        });
                        console.log("Created new user from Google sign-in:", username);
                    } catch (createError) {
                        console.error("Error creating user:", createError);
                        return false;
                    }
            }
            
            return true;
        } catch (error) {
            console.error("Error during Google sign in:", error);
            return false;
        }
        }
      
        return true; // Allow credential sign-ins to proceed normally
      },
    async jwt({ token , user , account}) {
        if (user){
            if (account?.provider === "google") {
                // For Google sign-in, fetch the user from DB using email
                await dbConnect();
                const dbUser = await UserModel.findOne({ email: user.email });
                
                if (dbUser) {
                  token._id = dbUser._id?.toString();
                  token.isVerified = dbUser.isVerified;
                  token.isAcceptingMessages = dbUser.isAcceptingMessages;
                  token.username = dbUser.username;
                }
              } else {
                // For credential sign-in, use data from authorize callback
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;
              }

        }
        return token
      },
    async session({ session, token }) {
        if (token){ 
            session.user._id = token._id
            session.user.isVerified = token.isVerified
            session.user.isAcceptingMessages = token.isAcceptingMessages
            session.user.username = token.username
        }
        return session
    },
// async redirect({ url, baseUrl }) {
//     // If the URL starts with the base URL, it's a relative URL
//     if (url.startsWith(baseUrl)) {
//       // For the default callback URL '/dashboard', redirect to personalized dashboard
//         if (url === `${baseUrl}/dashboard`) {
//             // Get the username from the session in getServerSession
//             // We can't do that here, so we'll implement option 2 instead
//             return url;
//         }
//         return url;
//         } else if (url.startsWith('/')) {
//         // For relative URLs, add the base URL
//         return `${baseUrl}${url}`;
//     }
//     // For external URLs, keep them as is
//     return url;
//   }

},
    pages: { signIn: '/sign-in', error: '/error' }, 
    session: {
        strategy: "jwt"
    },
    debug: process.env.NODE_ENV === 'development',
    secret: process.env.NEXTAUTH_SECRET

}