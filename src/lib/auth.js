import GoogleProvider from "next-auth/providers/google";
import { getServerSupabase } from "@/lib/supabase";

const USERS_TABLE = "users";

async function syncUserToSupabase(user) {
  const userId = typeof user?.id === "string" ? user.id : "";
  const email = typeof user?.email === "string" ? user.email : "";

  if (!userId || !email) return;

  const now = new Date().toISOString();
  const supabase = getServerSupabase();

  // upsert inserts on first login and updates subsequent logins.
  const { error } = await supabase.from(USERS_TABLE).upsert(
    {
      id: userId,
      email,
      name: user?.name ?? null,
      image: user?.image ?? null,
      last_sign_in_at: now,
      updated_at: now,
    },
    { onConflict: "id" }
  );

  if (error) {
    // Avoid blocking auth if user sync fails.
    console.error("Failed to sync user to Supabase:", error.message);
  }
}

/**
 * NextAuth configuration for Google OAuth.
 * Required env: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, NEXTAUTH_SECRET, NEXTAUTH_URL
 */
export const authOptions = {
  pages: {
    signIn: "/auth/sign-in",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
  callbacks: {
    async signIn({ user }) {
      await syncUserToSupabase(user);
      return true;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
};
