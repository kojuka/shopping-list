import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const listByRecipient = query({
  args: { recipientId: v.id("recipients") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("items")
      .withIndex("by_recipient", (q) => q.eq("recipientId", args.recipientId))
      .collect();
  },
});

export const create = mutation({
  args: {
    recipientId: v.id("recipients"),
    name: v.string(),
    cost: v.number(),
    status: v.union(
      v.literal("planning"),
      v.literal("bought"),
      v.literal("shipped"),
      v.literal("wrapped"),
      v.literal("delayed")
    ),
    notes: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("items", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("items"),
    name: v.optional(v.string()),
    cost: v.optional(v.number()),
    status: v.optional(
      v.union(
        v.literal("planning"),
        v.literal("bought"),
        v.literal("shipped"),
        v.literal("wrapped"),
        v.literal("delayed")
      )
    ),
    notes: v.optional(v.string()),
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
  args: { id: v.id("items") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

