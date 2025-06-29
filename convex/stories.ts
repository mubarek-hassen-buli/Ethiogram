import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthenticatedUser } from "./users";

export const createStory = mutation({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);

    // Deactivate any existing active story for the current user
    const existingActiveStory = await ctx.db
      .query("stories")
      .withIndex("by_user_and_active", (q) =>
        q.eq("userId", currentUser._id).eq("isActive", true)
      )
      .first();

    if (existingActiveStory) {
      await ctx.db.patch(existingActiveStory._id, { isActive: false });
    }

    const imageUrl = await ctx.storage.getUrl(args.storageId);
    if (!imageUrl) throw new Error("Image not found");

    // Create the new story
    const storyId = await ctx.db.insert("stories", {
      userId: currentUser._id,
      imageUrl,
      storageId: args.storageId,
      createdAt: Date.now(),
      isActive: true,
    });

    return storyId;
  },
});

export const getCurrentStory = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const story = await ctx.db
      .query("stories")
      .withIndex("by_user_and_active", (q) =>
        q.eq("userId", args.userId).eq("isActive", true)
      )
      .first();
    return story;
  },
});

export const getStoryArchive = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const stories = await ctx.db
      .query("stories")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
    return stories;
  },
});

export const generateUploadUrl = mutation(async (ctx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthorized");
  return await ctx.storage.generateUploadUrl();
});


