import { NextRequest, NextResponse } from "next/server";
import { auth } from "./app/lib/auth";
import { headers } from "next/headers";

const protectedRoute = {
	admin: ["/admin"],
	user: ["/profile", "/cart"]
}

export async function middleware(request: NextRequest) {
	const { nextUrl } = request;
	const currentPath = nextUrl.pathname;

	const session = await auth.api.getSession({
        headers: await headers()
    })

	const userRole = session?.user?.role
	const isLoggedIn = !!session;

	const isAdminRoute = protectedRoute.admin.some(route => 
		currentPath.startsWith(route)
	)

	const isUserRoute = protectedRoute.user.some((route) =>
    	currentPath.startsWith(route)
  	);

    if(!isLoggedIn && (isAdminRoute || isUserRoute)) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }

	if(isLoggedIn && isAdminRoute && userRole !== 'admin'){
		return NextResponse.redirect(new URL("/", request.url))
	}

	if (isLoggedIn && (currentPath === "/sign-in" || currentPath === "/sign-up")) {
        const redirectPath = userRole === 'admin' ? '/admin' : '/profile';
        return NextResponse.redirect(new URL(redirectPath, request.url));
    }

    return NextResponse.next();

 
    // THIS IS NOT SECURE!
    // This is the recommended approach to optimistically redirect users
    // We recommend handling auth checks in each page/route

}
 
export const config = {
	runtime: "nodejs",
	matcher: ["/profile", "/cart", "/admin",
		'/((?!api|_next/static|_next/image|.*\\.png$).*)'
	], 
};