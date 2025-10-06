import { headers } from "next/headers";
import { auth } from "../../../lib/auth";
import { redirect } from "next/navigation";
import EditProfile from "@/app/components/forms/profile/edit-profile";
import { Suspense } from "react";
import { SkeletonProfile } from "@/components/ui/skeleton/skeleton";
import RateForm from "@/app/components/forms/rate-form";

export default async function Profile() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const userData = {
    id: session.user.id,
    name: session.user.name,
    username: session.user.username,
    email: session.user.email,
    phoneNumber: session.user.phoneNumber,
  }

  return (
    <>
      <div className="w-full flex flex-col ">
        <div className="flex justify-between items-center w-full px-3 font-sans border-b border-black pb-5">
          <h1 className="text-2xl font-bold">Profile</h1>
          <h1 className="text-2xl font-bold">Edit Profile</h1>
        </div>
        <Suspense fallback={<SkeletonProfile />}>
          <EditProfile
            userData={userData}
          />
        </Suspense>
      </div>


    </>
  );
}
