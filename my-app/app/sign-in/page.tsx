"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@radix-ui/react-label"
import Link from "next/link";



export default function SignpIn(){
        return(
            <div className="flex min-h-screen items-center justify-center  bg-white p-4">
            <Card className="w-full max-w-md border-gray-200 shadow-lg ">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-black">
                        Sign In
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                        Enter your credientials to access your account
                    </CardDescription>
                </CardHeader>
                <form className="space-y-4">
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="vijay_thalapathy@gmail.com" required />
                        </div>
                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" maxLength={8} type="password" required />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col justify-between gap-2">
                        <Button className="w-full text-md font-sans" type="submit">
                            Sign In
                        </Button>
                        <p>create account? <Link href="/sign-up" className="text-primary underline">Sign Up</Link></p>
                    </CardFooter>
                </form>
            </Card>
            
        </div>
        )
} 