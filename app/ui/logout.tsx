'use client';
import { useRouter } from "next/navigation";
import { authClient } from "../lib/auth-client"
import Button from "./button";

export default function Logout(){
    const router = useRouter();
    const handleLogout = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push('/sign-in')
                }
            }
        });
    }

    return(
        <Button onClick={handleLogout} variant="primary" size="lg">
            Logout
        </Button>
    )
}