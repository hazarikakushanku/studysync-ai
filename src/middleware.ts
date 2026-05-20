import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// this middleware runs on every request to check if user is logged in
export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

// tells Next.js which routes this middleware should run on
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
