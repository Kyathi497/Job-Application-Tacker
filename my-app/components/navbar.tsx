import { BriefcaseIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { getSession } from "@/lib/auth/auth";
import { DropdownMenu, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";


export default async function Navbar() {
    const session = await getSession();
    return (
        <nav className="border-b border-gray-200 bg-white">
            <div className="container mx-auto flex h-16 items-center px-4 justify-between">
                <Link href="/" className="flex items-center gap-2 text-xl font-semibold text-primary">
                    <BriefcaseIcon/>
                    Job Tracker
                </Link>
                
                {session?.user ? (
                    <>
                        
                            <Link href="/dashboard">
                            <Button variant="ghost" className="text-gray-700 hover:text-black">Dashboard</Button>
                        </Link>
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <Button variant="ghost" >
                                    <Avatar>
                                        <AvatarFallback className="bg-primary text-white">
                                            {session.user.name[0].toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                        </DropdownMenu>
                        
                    </>
                ) : <div className="flex items-center gap-4">
                    <Link href="/sign-in" >
                        <Button variant="ghost" className="text-gray-700 hover:text-black">
                            Log In
                        </Button>
                    </Link>
                    <Link href="/sign-up">
                        <Button className="bg-primary hover:bg-primary/90">
                            Start for free
                        </Button>
                    </Link>
                </div>}
            </div>

        </nav>
    )
}
