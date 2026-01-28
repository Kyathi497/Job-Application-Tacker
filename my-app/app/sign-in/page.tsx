"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { signIn } from "@/lib/auth/auth-client"
import { Label } from "@radix-ui/react-label"
import Link from "next/link";
import { useRouter } from "next/navigation"
import { useState } from "react"



export default function SignpIn(){
        const [email, setEmail] = useState("");
        const [password, setPassword] = useState("");

        const [error, setError] = useState("");
        const [loading, setLoading] = useState(false);

        const router = useRouter();

        async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const result = await signIn.email({
            email,
            password,
            });

            if (result?.error) {
            const message = result.error.message?.toLowerCase() || "";

            if (
                result.error.code === "USER_NOT_FOUND" ||
                message.includes("not found") ||
                message.includes("does not exist")
            ) {
                setError("Email not found. Create a new account.");
            } 
            else if (
                result.error.code === "INVALID_PASSWORD" ||
                message.includes("password")
            ) {
                setError("Incorrect password.");
            } 
            else {
                setError(result.error.message || "Login failed.");
            }

            return;
            }

            // Success
            router.push("/dashboard");

        } catch (error) {
            setError("Failed to login. Please try again.");
        } finally {
            setLoading(false);
        }
        }

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
                <form onSubmit={handleSubmit} className="space-y-4">
                    <CardContent className="space-y-4">
                        {error && <p>{error}</p>}
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="vijay_thalapathy@gmail.com" required />
                        </div>
                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" value={password} onChange={(e) => setPassword(e.target.value)} maxLength={8} type="password" required />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col justify-between gap-2">
                        <Button className="w-full text-md font-sans" type="submit">
                            {loading ? "loading":"Sign In"}
                        </Button>
                        <p>create account? <Link href="/sign-up" className="text-primary underline">Sign Up</Link></p>
                    </CardFooter>
                </form>
            </Card>
            
        </div>
        )
} 