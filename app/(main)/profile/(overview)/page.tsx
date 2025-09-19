import { headers } from "next/headers";
import { auth } from "../../../lib/auth";
import { redirect } from "next/navigation";
import EditProfile from "@/app/components/forms/profile/edit-profile";
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
      <div className="w-full flex flex-col justify-center items-center">
        <h1>Profile</h1>
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
