import Google from "@auth/core/providers/google";
import { convexAuth } from "@convex-dev/auth/server";

// Allowed emails (set via ALLOWED_EMAILS env var)
const getAllowedEmails = (): string[] => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const envValue = (globalThis as any).process?.env?.ALLOWED_EMAILS as string | undefined;
  if (!envValue) return [];
  return envValue.split(",").map((e: string) => e.trim().toLowerCase());
};

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [Google],
  callbacks: {
    async createOrUpdateUser(ctx, args) {
      // Check if email is in the allowed list
      const allowedEmails = getAllowedEmails();
      
      if (allowedEmails.length > 0) {
        const email = args.profile?.email?.toLowerCase();
        if (!email || !allowedEmails.includes(email)) {
          throw new Error("Access denied. Your email is not authorized to use this app.");
        }
      }

      // Default behavior: create or update the user
      if (args.existingUserId) {
        return args.existingUserId;
      }
      
      return ctx.db.insert("users", {
        name: args.profile?.name,
        email: args.profile?.email,
        image: args.profile?.image,
      });
    },
  },
});
