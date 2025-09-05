'use client';
import { useRouter } from "next/navigation";
import { authClient } from "../lib/auth-client"
import Button from "./button";
import { IoLogOut } from "react-icons/io5";

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
       <Button onClick={handleLogout} className="text-left text-lg font-dmSans">
            <span className="flex items-center gap-3">
                <IoLogOut />
                Log Out
            </span>
        </Button>
    )
}