// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "./app/lib/auth";
import { headers } from "next/headers";

const protectedRoute = {
	admin: ["/admin"],
	adminOnly: ["/admin/audit-logs"], // Only admin, not staff
	user: ["/profile", "/cart"],
	product: ["/product/"]
}

export async function middleware(request: NextRequest) {
	const { nextUrl } = request;
	const currentPath = nextUrl.pathname;

	const session = await auth.api.getSession({
		headers: await headers()
	})

	const userRole = session?.user.role;
	const isLoggedIn = !!session;

	const isAdminRoute = protectedRoute.admin.some(route => 
		currentPath.startsWith(route)
	);

	const isAdminOnlyRoute = protectedRoute.adminOnly.some(route => 
		currentPath.startsWith(route)
	);

	const isUserRoute = protectedRoute.user.some((route) =>
    	currentPath.startsWith(route)
  	);

	const isCheckoutRoute = /^\/product\/[^/]+\/checkout(\/confirm)?$/.test(currentPath);

	// Redirect to sign-in if not logged in and accessing protected routes
    if (!isLoggedIn && (isAdminRoute || isUserRoute || isCheckoutRoute)) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }

	// Admin routes: allow admin and staff
	if (isLoggedIn && isAdminRoute && userRole !== 'admin' && userRole !== 'staff') {
		return NextResponse.redirect(new URL("/", request.url));
	}

	// Admin-only routes: only allow admin (not staff)
	if (isLoggedIn && isAdminOnlyRoute && userRole !== 'admin') {
		return NextResponse.redirect(new URL("/admin", request.url));
	}

	// Redirect logged-in users away from auth pages
	if (isLoggedIn && (currentPath === "/sign-in" || currentPath === "/sign-up")) {
        const redirectPath = (userRole === 'admin' || userRole === 'staff') ? '/admin' : '/profile';
        return NextResponse.redirect(new URL(redirectPath, request.url));
    }

    return NextResponse.next();
}
 
export const config = {
	runtime: "nodejs",
	matcher: [
		"/profile", 
		"/cart", 
		"/admin/:path*", 
		"/product/:path*",
		'/((?!api|_next/static|_next/image|.*\\.png$).*)'
	], 
};