import { getToken } from "next-auth/jwt";
import { authOptions } from "./auth";

export async function getJWTToken(req) {
  return await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET 
  });
}

export function decodeJWT(token) {
  if (!token) return null;
  
  try {
    // JWT имеет формат: header.payload.signature
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
}