
"use client"

import { signOut } from "@/lib/auth/auth-client"
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu"
import { useRouter } from "next/navigation";


export default function signOutButton() {
    const router = useRouter();
    return(
        <DropdownMenuItem
  className="
    flex items-center gap-2
    text-sm font-medium
    text-red-600
    hover:bg-red-50
    hover:text-red-700
    rounded-md
    px-3 py-2
    transition-colors
    pointer-fine::
  "
  onClick={async () => {
    const result = await signOut()
    if (result.data?.success) {
      router.push('/sign-in')
    } else {
      alert('Error signing out..')
    }
  }}
>
  Log out
</DropdownMenuItem>

    )
}