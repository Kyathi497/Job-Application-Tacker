"use client"

import { Button } from "@/components/ui/button"
import { signUp } from "@/lib/auth/auth-client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@radix-ui/react-label"
import Link from "next/link";
import { useState } from "react"
import { useRouter } from "next/navigation";

// h[cal(100vh-4rem)

export default function SignUp() {
    const [name,setName] = useState("");
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
            const result = await signUp.email({
            name,
            email,
            password,
            });

            if (result?.error) {
            // Handle specific errors
            if (
                result.error.code === "USER_ALREADY_EXISTS" ||
                result.error.message?.toLowerCase().includes("already")
            ) {
                setError("Email already exists. Please sign in.");
            } else {
                setError(result.error.message || "Failed to sign up.");
            }
            return;
            }

    // Success
    router.push("/dashboard");

  } catch (error) {
    setError("An unexpected error occurred. Please try again.");
  } finally {
    setLoading(false);
  }
}

    return (
        <div className="flex min-h-screen items-center justify-center bg-white p-4">
            <Card className="w-full max-w-md border-gray-200 shadow-lg ">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-black">
                        Sign Up
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                        create an account to start tracking your job applications
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <CardContent className="space-y-4">
                        {error && (
                            <div className="text-sm text-destructive p-3">{error}</div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-gray-700">Name</Label>
                            <Input id="name" value={name} onChange={(e)=> setName(e.target.value)} type="text" placeholder="Vijay Thalapathy" required />
                        </div>
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" value={email} onChange={(e)=> setEmail(e.target.value)} type="email" placeholder="vijay_thalapathy@gmail.com" required />
                        </div>
                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" value={password} onChange={(e)=> setPassword(e.target.value)} maxLength={8} type="password" required />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col justify-between gap-2">
                        <Button className="w-full text-md font-sans" type="submit" disabled={loading}>
                            {loading ? "Creating account..": "Sign Up"}
                        </Button>
                        <p>Already have an account? <Link href="/sign-in" className="text-primary underline">Sign In</Link></p>
                    </CardFooter>
                </form>
            </Card>
            
        </div>
    )
} 