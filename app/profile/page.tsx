import { headers } from "next/headers"
import { auth } from "../lib/auth"
import { redirect } from "next/navigation"
import Logout from "../ui/logout"



export default async function Profile() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if(!session) redirect ("/sign-in")

  return (
    <>
      <div className="h-screen flex justify-center items-center">
        <h1>Profile Page</h1>
        <p>Welcome {session.user.name}</p>
        <p>Email: {session.user.email}</p>
        <Logout/>
      </div>
    </>
  )
}
