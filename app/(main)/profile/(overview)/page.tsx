import { headers } from "next/headers";
import { auth } from "../../../lib/auth";
import { redirect } from "next/navigation";
import EditProfile from "@/app/components/forms/edit-profile";
import { Suspense } from "react";
import { SkeletonProfile } from "@/components/ui/skeleton/skeleton";
import { DMSans } from "@/app/ui/fonts";

export default async function Profile() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <>
      <div className="flex flex-col w-full items-center gap-6">
          <div className={`${DMSans.className} flex w-full justify-between items-center border-b border-black pb-4 text-dark-brown`}>
            <h1 className="text-2xl font-bold text-gray-800">Profile Information</h1>
            <h1 className="text-2xl font-bold">Edit Profile</h1>
          </div>
          <Suspense fallback={<SkeletonProfile />}>
            <EditProfile
              userData={{
                id: session.user.id,
                name: session.user.name,
                username: session.user.username,
                email: session.user.email,
                phoneNumber: session.user.phoneNumber,
              }}
            />
          </Suspense>
      </div>
    </>
  );
}
