import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";


export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("jwt_token");
  const isAuthPage = request.nextUrl.pathname === "/auth" 
  const pathname = request.nextUrl.pathname;
  const isExcludedRoute =
  pathname.startsWith("/auth/callback") ||
  pathname.startsWith("/auth/verify-email") || 
  pathname.startsWith("/auth/otp")


  if (isExcludedRoute) {
    return NextResponse.next();
  }
  if (accessToken && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  if (!accessToken && !isAuthPage){
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ['/dashboard/:path*','/auth/:path*','/','/profile/:path*','/game/:path*','/chat/:path*'],
};