import { NextResponse, NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const response = fetch('http://localhost:5000/users/profile', {
    cache: 'no-store',
    credentials: "include"
  });
  
  // console.log(response.status);
  return NextResponse.redirect(new URL('http://localhost:5000/users/profile'))
}

// what routes does this apply to?
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    //'/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    '/login'
  ],
}
