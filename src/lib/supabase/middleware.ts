import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// middleware to check if user is logged in and protect routes
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  // if supabase env vars are not set, skip auth checks (demo mode)
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return supabaseResponse;
  }

  let supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: any[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // get the current user
  let { data: { user } } = await supabase.auth.getUser();

  // list of routes that require login
  let protectedPaths = [
    "/dashboard", "/todo", "/pomodoro", "/planner", "/challenges",
    "/sticky-notes", "/whiteboard", "/leaderboard", "/roadmaps",
    "/analytics", "/settings", "/posts",
  ];

  // check if current path needs protection
  let isProtected = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  // redirect to login if not authenticated
  if (isProtected && !user) {
    let url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // redirect logged in users away from login/signup pages
  let authPaths = ["/login", "/signup"];
  let isAuthPage = authPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isAuthPage && user) {
    let url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
