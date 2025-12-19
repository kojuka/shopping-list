import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const recipients = await ctx.db.query("recipients").collect();
    
    // Calculate committed and spent amounts for each recipient
    const recipientsWithBudget = await Promise.all(
      recipients.map(async (recipient) => {
        const items = await ctx.db
          .query("items")
          .withIndex("by_recipient", (q) => q.eq("recipientId", recipient._id))
          .collect();
        
        // Committed = planned items (not yet bought)
        const committed = items
          .filter((item) => item.status === "planned")
          .reduce((sum, item) => sum + item.cost, 0);
        
        // Spent = bought, shipped, wrapped items (actually purchased)
        const spent = items
          .filter((item) => ["bought", "shipped", "wrapped"].includes(item.status))
          .reduce((sum, item) => sum + item.cost, 0);
        
        return { ...recipient, committed, spent };
      })
    );
    
    return recipientsWithBudget.sort((a, b) => a.order - b.order);
  },
});

export const getGlobalBudget = query({
  args: {},
  handler: async (ctx) => {
    const recipients = await ctx.db.query("recipients").collect();
    const totalBudget = recipients.reduce((sum, r) => sum + r.budget, 0);
    
    // Get all items to calculate totals
    const items = await ctx.db.query("items").collect();
    
    // Committed = planned items (not yet bought)
    const totalCommitted = items
      .filter((item) => item.status === "planned")
      .reduce((sum, item) => sum + item.cost, 0);
    
    // Spent = bought, shipped, wrapped items (actually purchased)
    const totalSpent = items
      .filter((item) => ["bought", "shipped", "wrapped"].includes(item.status))
      .reduce((sum, item) => sum + item.cost, 0);
    
    // Available = budget minus committed and spent
    const available = totalBudget - totalCommitted - totalSpent;
    
    // Utilization = (committed + spent) / budget
    const totalAllocated = totalCommitted + totalSpent;
    const percentUtilized = totalBudget > 0 ? Math.round((totalAllocated / totalBudget) * 100) : 0;
    
    return {
      totalBudget,
      totalCommitted,
      totalSpent,
      available,
      percentUtilized,
    };
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    budget: v.number(),
  },
  handler: async (ctx, args) => {
    const recipients = await ctx.db.query("recipients").collect();
    const maxOrder = recipients.reduce((max, r) => Math.max(max, r.order), -1);
    
    return await ctx.db.insert("recipients", {
      name: args.name,
      budget: args.budget,
      order: maxOrder + 1,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("recipients"),
    name: v.optional(v.string()),
    budget: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );
    await ctx.db.patch(id, filteredUpdates);
  },
});

export const remove = mutation({
  args: { id: v.id("recipients") },
  handler: async (ctx, args) => {
    // Delete all items for this recipient first
    const items = await ctx.db
      .query("items")
      .withIndex("by_recipient", (q) => q.eq("recipientId", args.id))
      .collect();
    
    for (const item of items) {
      await ctx.db.delete(item._id);
    }
    
    await ctx.db.delete(args.id);
  },
});
