"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, History, MapPinHouse } from "lucide-react";
import Logout from "../logout";

export default function SideProfile() {
  const pathname = usePathname();

  const links = [
    { href: "/profile", label: "Profile Information", icon: <User /> },

    { href: "/profile/order", label: "Order History", icon: <History /> },
    {
      href: "/profile/shipping-address",
      label: "Shipping Address",
      icon: <MapPinHouse />,
    },
  ];

  return (
    <div className="flex justify-center gap-7 pl-6">
      <div className="flex flex-col justify-between h-[500px] w-[300px] bg-gray-100 p-10 rounded-md inset-shadow-nav">
        <div className="space-y-4">
          {links.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-left text-lg font-dmSans flex items-center gap-3 px-3 py-2 rounded-md transition-all
                  ${
                    isActive
                      ? "bg-army-brown text-white shadow-md"
                      : "text-gray-800 hover:bg-gray-200"
                  }`}
              >
                {link.icon}
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="border-t-2 pt-5">
          <Logout />
        </div>
      </div>
    </div>
  );
}
