import { mutation } from "./_generated/server";

// One-time migration to update "planning" status to "planned"
export const migratePlanningToPlanned = mutation({
  args: {},
  handler: async (ctx) => {
    const items = await ctx.db.query("items").collect();
    let updated = 0;
    
    for (const item of items) {
      // @ts-expect-error - "planning" is the old status we're migrating from
      if (item.status === "planning") {
        await ctx.db.patch(item._id, { status: "planned" });
        updated++;
      }
    }
    
    return { updated };
  },
});

