import { NextResponse, NextRequest } from 'next/server';

// export async function middleware(request: NextRequest) {
//   // const response = await fetch('http://localhost:5000/auth/login', {
//   //   cache: 'no-store',
//   //   credentials: "include"
//   // });

//   // console.log(response)
//   // // user hasn't authenticated
//   // if (response.status === 404) {
//   //   return NextResponse.redirect('http://localhost:5000/auth/login');
//   // } 
//   // // user has authenticated, parse the json
//   // else {
//   //   const profile = await response.json();
//   //   console.log('Profile data:', profile);
//   // }

//   // return NextResponse.next();
// }



export async function middleware(request: NextRequest) {
  const response = await fetch('http://localhost:5000/users/profile', {
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
    // '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    '/test'
  ],
}