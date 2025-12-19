import Google from "@auth/core/providers/google";
import { convexAuth } from "@convex-dev/auth/server";

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [Google],
  callbacks: {
    async createOrUpdateUser(ctx, args) {
      // Check if email is in the allowed list
      const allowedEmails = process.env.ALLOWED_EMAILS?.split(",").map(e => e.trim().toLowerCase()) ?? [];
      
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
