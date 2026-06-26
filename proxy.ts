import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
    const token = request.cookies.get("auth_token")?.value;
    const { pathname } = request.nextUrl;

    const isProtectedRoute = pathname.startsWith("/dashboard");
    const isPublicOnlyRoute =
        pathname.startsWith("/login") || pathname.startsWith("/register");

    if (isProtectedRoute && !token) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    if (isPublicOnlyRoute && token) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};
