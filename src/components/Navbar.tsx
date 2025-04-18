"use client";
import React from 'react'
import { useSession , signOut} from 'next-auth/react';
import { Button } from './ui/button';
import Link from 'next/link';

//import {User} from 'next-auth'



const Navbar = () => {

    const { data: session, status } = useSession()

return (
    <div className='min-h-24 min-w-[100vw] bg-gray-100 flex justify-between items-center  '>
        <div className='sm:text-4xl text-2xl font-bold font-sans p-4'>
            <Link href={"/"}>Confessions</Link>
        </div>
        
        <div className='p-4'>
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