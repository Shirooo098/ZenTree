import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "./app/lib/auth";
import { getSessionCookie } from "better-auth/cookies";

const protectedRoute = ["/admin"]

export async function middleware(request: NextRequest) {
	const { nextUrl } = request;
	const sessionCookie = getSessionCookie(request);

	const res = NextResponse.next();
 
    // THIS IS NOT SECURE!
    // This is the recommended approach to optimistically redirect users
    // We recommend handling auth checks in each page/route
	const isLoggedIn = !!sessionCookie
	const isOnProtectedRoute = protectedRoute.includes(nextUrl.pathname)

	if(isOnProtectedRoute && !isLoggedIn){
		return NextResponse.redirect(new URL("/sign-in", request.url));
	}

	if (isLoggedIn && (nextUrl.pathname === "/sign-in" || nextUrl.pathname === "/sign-up")) {
    	return NextResponse.redirect(new URL("/profile", request.url));
  	}

	return res;
}
 
export const config = {
	matcher: ["/profile", "/cart", "/admin",
		'/((?!api|_next/static|_next/image|.*\\.png$).*)'
	], 
};