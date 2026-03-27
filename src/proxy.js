import { withAuth } from "next-auth/middleware";

export default withAuth(
  function proxy() {},
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const path = req.nextUrl.pathname;
        if (path === "/") return true;
        if (path.startsWith("/auth/sign-in")) return true;
        if (/\.(svg|png|jpg|jpeg|gif|webp|ico|woff2?)$/i.test(path)) return true;
        return !!token;
      },
    },
    pages: {
      signIn: "/auth/sign-in",
    },
  }
);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
