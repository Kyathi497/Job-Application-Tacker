import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import { headers } from "next/headers";

const client = new MongoClient(process.env.MONGO_URL!);
const db = client.db();

export const auth = betterAuth({
    database: mongodbAdapter(db, {
        client,
    }),
    emailAndPassword: {
        enabled: true,
    }
})

export const getSession = async () => {
    const result = await auth.api.getSession({
        headers: await headers()
    })
    return result
}
