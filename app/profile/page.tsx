import { headers } from "next/headers"
import { auth } from "../lib/auth"
import { redirect } from "next/navigation"
import Button from "../ui/button"


export default async function Profile() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if(!session) redirect ("/sign-in")

  return (
    <>
      <div>
        <h1>Profile Page</h1>
        <p>Welcome {session.user.name}</p>
        <Button variant="primary" size="lg">Logout</Button>
      </div>
    </>
  )
}
