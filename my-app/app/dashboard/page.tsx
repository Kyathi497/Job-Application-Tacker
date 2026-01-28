"use client"
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";


export default function Dashboard() {
    const [error, setError] = useState("");
    const router = useRouter();
    async function handleLogout() {
        const result = signOut();
        if ((await result).error) {
            setError("Failed to Log out")
        }else{
            router.push('/sign-in');
        }
    }
    return(
        <div className="flex items-center justify-end gap-5">
            <p>Dashboard goes here..</p>
            <Button onClick={handleLogout} className="bg-primary ">
                Log out
            </Button>
        </div>
    )
} 