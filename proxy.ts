import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Cookie name set by the backend on successful login */
const AUTH_COOKIE = "auth_token";
const USER_DATA_COOKIE = "user_data";

/** Routes that require authentication */
const PROTECTED_PREFIXES = ["/dashboard", "/admin"];

/** Routes only accessible when NOT authenticated */
const PUBLIC_ONLY_PATHS = ["/login", "/register"];

/**
 * Next.js proxy function (equivalent to middleware in earlier versions).
 * Handles route protection and auth-based redirects.
 */
export function proxy(request: NextRequest) {
    const token = request.cookies.get(AUTH_COOKIE)?.value;
    const userDataCookie = request.cookies.get(USER_DATA_COOKIE)?.value;
    const { pathname } = request.nextUrl;

    const isProtected = PROTECTED_PREFIXES.some(
        (prefix) => pathname === prefix || pathname.startsWith(prefix + "/")
    );
    const isPublicOnly = PUBLIC_ONLY_PATHS.some(
        (path) => pathname === path || pathname.startsWith(path + "/")
    );

    // No token → redirect to login when trying to access protected routes
    if (isProtected && !token) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // Has token → redirect away from login/register based on role
    if (isPublicOnly && token) {
        let userRole = "user";
        if (userDataCookie) {
            try {
                const userData = JSON.parse(userDataCookie);
                userRole = userData.role || "user";
            } catch {
                // If parsing fails, default to user
                userRole = "user";
            }
        }

        // Role-based redirection
        if (userRole === "admin") {
            return NextResponse.redirect(new URL("/admin", request.url));
        } else {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths EXCEPT:
         * - _next/static (static files)
         * - _next/image (image optimization)
         * - favicon.ico
         * - Public assets (images)
         * - Proxied /uploads/ (backend served files)
         */
        "/((?!_next/static|_next/image|favicon\\.ico|uploads|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.webp$|.*\\.svg$|.*\\.ico$).*)",
    ],
};
