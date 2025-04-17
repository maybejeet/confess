"use client";
import React from 'react'
import { useSession , signOut} from 'next-auth/react';
import { Button } from './ui/button';
import Link from 'next/link';

//import {User} from 'next-auth'



const Navbar = () => {

    const { data: session, status } = useSession()

return (
    <div className='min-h-24 w-full bg-gray-100 flex justify-between items-center  pr-[5%] pl-[5%]'>
        <div className='text-4xl font-bold font-sans'>
            <Link href={"/"}>Confessions</Link>
        </div>
        
        <div>
            {status === "authenticated" || session ?
            <>
            <Link href={"/sign-in"}>
                <Button onClick={() => signOut()}> Sign out </Button>
            </Link>
            </> 
            :
            <>
            <Link href={"/sign-in"}>
                <Button> Sign in </Button>
            </Link>
            </>
        }
        </div>
    </div>
)
}

export default Navbar