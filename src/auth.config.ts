import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: { signIn: "/admin/login" },
  session: { strategy: "jwt" },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const path = request.nextUrl.pathname;
      const isAdmin = path.startsWith("/admin");
      const isLogin = path === "/admin/login";
      if (isAdmin && !isLogin) return !!auth;
      return true;
    },
  },
} satisfies NextAuthConfig;
