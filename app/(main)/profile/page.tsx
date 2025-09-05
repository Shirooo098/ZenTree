

import { headers } from "next/headers"
import { auth } from "../../lib/auth"
import { redirect } from "next/navigation"
import Logout from "../../ui/logout"
import EditProfile from "@/app/components/forms/edit-profile"


export default async function Profile() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if(!session) {
    redirect ("/sign-in")
  }

  return (
    <>
      <div className="h-screen flex flex-col justify-center items-center">
        <h1>Profile Page</h1>
        <EditProfile userData={{
            id: session.user.id,
            name: session.user.name,
            username: session.user.username,
            email: session.user.email,
            phoneNumber: session.user.phoneNumber, 
          }}/>

        <Logout/>
      </div>
    </>
  )
}
