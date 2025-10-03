import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
export async function getCurrentSession() {
return await getServerSession(authOptions);
}
export async function getCurrentUser() {
const session = await getCurrentSession();
return session?.user;
}