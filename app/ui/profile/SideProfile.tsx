"use client";

import Link from 'next/link'
import { useState } from "react";


import { FaUser } from "react-icons/fa6";

import Logout from '../logout';
import { Box, Clock10  } from 'lucide-react';


export default function SideProfile() {
  const [activeSection, setActiveSection] = useState("profile");
  return (
    <div className="flex items-center justify-center gap-7 pl-6 ">
      <div className="flex flex-col justify-between h-[500px] w-[300px] bg-gray-100 p-10 rounded-md inset-shadow-nav">
       <div className="space-y-4 ">
         <Link href="/profile"
          className="text-left text-lg font-dmSans flex items-center gap-3" >
          <FaUser />
          Profile Information
        </Link>

<<<<<<< HEAD
        <Link href="/profile/order-history"
          className="text-left text-lg font-dmSans flex items-center gap-3" >
            
            <Clock10 strokeWidth={1} />
=======
        <Link href="/profile/order"
          className="text-left text-lg font-dmSans flex items-center gap-3" >
          <FaLocationDot />
>>>>>>> c1e3ceb65f10aaf228b041d53a1873c2df2facdd
          Order History
        </Link>

        <Link href='/profile/order-tracking'
         className="text-left text-lg font-dmSans flex items-center gap-3" >
            <Box strokeWidth={1}/>
          Order Tracking
        </Link>

       </div>
        <div className="border-t-2 pt-5">
          <Logout/>
        </div>
      </div>

     
    </div>
  );
}