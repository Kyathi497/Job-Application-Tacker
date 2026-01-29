
"use client"

import { signOut } from "@/lib/auth/auth-client"
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu"
import { useRouter } from "next/navigation";


export default function signOutButton() {
    const router = useRouter();
    return(
        <DropdownMenuItem onClick={async () =>{
            const result = await signOut();
            if (result.data?.success) {
                router.push('/sign-in')
            } else {
                alert("Error signing out..")
            }
        }}>Log Out</DropdownMenuItem>
    )
}