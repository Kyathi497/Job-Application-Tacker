"use client";

import { Briefcase } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";
import SignOutButton from "./sign-out-button";
import { useSession } from "@/lib/auth/auth-client";

export default function Navbar() {
  const { data: session } = useSession();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="container mx-auto flex h-16 items-center px-4 justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-semibold text-primary"
        >
          <Briefcase />
          Job Tracker
        </Link>
        <div className="flex items-center gap-4">
          {!isClient ? (
            // Show loading state or default state during SSR
            <>
              <Button
                variant="ghost"
                className="text-gray-700 hover:text-black"
                asChild
              >
                <Link href="/sign-in">
                  Log In
                </Link>
              </Button>
              <Button className="bg-primary hover:bg-primary/90" asChild>
                <Link href="/sign-up">
                  Start for free
                </Link>
              </Button>
            </>
          ) : session?.user ? (
            <>
              <Button
                variant="ghost"
                className="text-gray-700 hover:text-black"
                asChild
              >
                <Link href="/dashboard">
                  Dashboard
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-white">
                        {session.user.name[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {session.user.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {session.user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <SignOutButton />
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                className="text-gray-700 hover:text-black"
                asChild
              >
                <Link href="/sign-in">
                  Log In
                </Link>
              </Button>
              <Button className="bg-primary hover:bg-primary/90" asChild>
                <Link href="/sign-up">
                  Start for free
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}