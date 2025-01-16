import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";


export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("jwt_token");
  const isAuthPage = request.nextUrl.pathname === "/auth";

  if (accessToken && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  if (!accessToken && !isAuthPage){
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ['/dashboard/:path*','/auth','/','/profile/:path*','/game/:path*','/chat/:path*'],
};