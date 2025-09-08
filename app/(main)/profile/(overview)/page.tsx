import { headers } from "next/headers";
import { auth } from "../../../lib/auth";
import { redirect } from "next/navigation";
import EditProfile from "@/app/components/forms/edit-profile";
import { Suspense } from "react";
import { SkeletonProfile } from "@/components/ui/skeleton/skeleton";

export default async function Profile() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <>
      <div className="flex flex-col justify-center w-300 items-center gap-6">
        <div className="w-full px-15 pt-10 rounded-lg">
          <div className="flex justify-between items-center border-b border-gray-300 pb-4 ">
            <h1 className="text-2xl font-bold text-gray-800">Profile Information</h1>
            <h1 className="text-2xl font-bold text-blue-600">Edit Profile</h1>
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
      </div>
    </>
  );
}
