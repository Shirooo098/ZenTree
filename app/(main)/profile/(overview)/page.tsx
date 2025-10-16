"use client";

import { redirect } from "next/navigation";
import EditProfile from "@/app/components/forms/profile/edit-profile";
import { Suspense } from "react";
import { SkeletonProfile } from "@/components/ui/skeleton/skeleton";
import { useUser } from "@/context/user-context";

export default function Profile() {
    const { user } = useUser();
    if(!user) redirect("/sign-in")

    return(
    <>
      <div className="w-full flex flex-col ">
        <div className="flex justify-between items-center w-full px-3 font-sans border-b border-black pb-5">
          <h1 className="text-2xl font-bold">Profile</h1>
          <h1 className="text-2xl font-bold">Edit Profile</h1>
        </div>
        <Suspense fallback={<SkeletonProfile />}>
          <EditProfile
            userData={user}
          />
        </Suspense>
      </div>
    </>
  );
}
