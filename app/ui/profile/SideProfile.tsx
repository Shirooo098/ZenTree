"use client";

import Link from 'next/link'
import { useState } from "react";


import { FaUser } from "react-icons/fa6";
import { FaLocationDot } from "react-icons/fa6";
import { FaIdCard } from "react-icons/fa6";
import Logout from '../logout';
import { Box, Clock10  } from 'lucide-react';


export default function SideProfile() {
  const [activeSection, setActiveSection] = useState("profile");
  return (
    <div className="flex justify-center gap-7 pl-6 ">
      <div className="flex flex-col justify-between h-[500px] w-[300px] bg-gray-100 p-10 rounded-md inset-shadow-nav">
       <div className="space-y-4 ">
         <Link href="/profile"
          className="text-left text-lg font-dmSans flex items-center gap-3" >
          <User />
          Profile Information
        </Link>

        <Link href="/profile/shipping-address"
          className="text-left text-lg font-dmSans flex items-center gap-3" >
          <FaLocationDot />
          Shipping Addresses
        </Link>

        <Link href='/profile/billing-details'
         className="text-left text-lg font-dmSans flex items-center gap-3" >
          <FaIdCard />
          Billing Details
        </Link>

       </div>
        <div className="border-t-2 pt-5">
          <Logout/>
        </div>
      </div>


    </div>
  );
}