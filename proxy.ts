import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Institution routes protection
    if (path.startsWith("/institution") && token?.role !== "institution") {
      return NextResponse.redirect(new URL("/student/portal", req.url));
    }

    // Student routes protection
    if (path.startsWith("/student") && token?.role !== "student") {
      return NextResponse.redirect(new URL("/institution/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: [
    "/institution/:path*",
    "/student/:path*",
    "/api/certificates/:path*",
    "/api/institution/:path*",
  ],
};
