'use client';
import { authClient } from "../lib/auth-client"
import Button from "./button";

export default function Logout(){

    const handleLogout = async () => {
        await authClient.signOut();
    }

    return(
        <Button onClick={handleLogout} variant="primary" size="lg">
            Logout
        </Button>
    )
}