import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  recipients: defineTable({
    name: v.string(),
    budget: v.number(),
    order: v.number(),
  }),
  items: defineTable({
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
  }).index("by_recipient", ["recipientId"]),
});

