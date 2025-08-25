import { headers } from "next/headers"
import { auth } from "../lib/auth"
import { redirect } from "next/navigation"

export default async function Admin(){
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if(!session) redirect ("/sign-in")
    
    if(session.user.role !== "admin") return <h1>Unauthorized</h1>
    
    return(
        <>
            <div className="flex flex-col items-center">
                <h1>Admin</h1>
                <p>Name: {session.user.name}</p>
                <p>Email: {session.user.email}</p>
                <p>Role: {session.user.role}</p>
            </div>
        </>
    )
}