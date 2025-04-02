import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// List of public paths that don't require authentication
const publicPaths = [
  "/",
  "/listings",
  "/listings/[slug]/[id]",
  "/auth/signin",
  "/auth/signup",
  "/auth/forgot-password",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path is public
  const isPublicPath = publicPaths.some((path) => {
    if (path.includes("[")) {
      // Handle dynamic routes
      const basePath = path.split("/[")[0];
      return pathname.startsWith(basePath);
    }
    return pathname === path;
  });

  // Get the token from cookies
  const token = request.cookies.get("token")?.value;

  // If trying to access a protected route without authentication
  if (!isPublicPath && !token) {
    // Redirect to login page
    const loginUrl = new URL("/auth/signin", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If already authenticated and trying to access auth pages
  if (
    token &&
    (pathname.startsWith("/auth/signin") || pathname.startsWith("/auth/signup"))
  ) {
    // Redirect to home page
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Configure which paths the middleware should run on
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
