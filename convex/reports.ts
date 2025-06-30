import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthenticatedUser } from "./users";

export const createReport = mutation({
  args: {
    postId: v.id("posts"),
    reason: v.union(
      v.literal("spam"),
      v.literal("inappropriate"),
      v.literal("harassment"),
      v.literal("false_info"),
      v.literal("other")
    ),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);
    
    // Check if user already reported this post
    const existingReport = await ctx.db
      .query("reports")
      .withIndex("by_user_and_post", (q) =>
        q.eq("userId", currentUser._id).eq("postId", args.postId)
      )
      .first();

    if (existingReport) {
      throw new Error("You have already reported this post");
    }

    // Get the post to ensure it exists
    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw new Error("Post not found");
    }

    // Create the report
    const reportId = await ctx.db.insert("reports", {
      userId: currentUser._id,
      postId: args.postId,
      reportedUserId: post.userId,
      reason: args.reason,
      description: args.description,
      status: "pending",
      createdAt: Date.now(),
    });

    return reportId;
  },
});

export const getReportsByPost = query({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    // This would typically be admin-only functionality
    const reports = await ctx.db
      .query("reports")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .collect();

    const reportsWithUserInfo = await Promise.all(
      reports.map(async (report) => {
        const reporter = await ctx.db.get(report.userId);
        return {
          ...report,
          reporter: {
            _id: reporter?._id,
            username: reporter?.username,
          },
        };
      })
    );

    return reportsWithUserInfo;
  },
});

export const updateReportStatus = mutation({
  args: {
    reportId: v.id("reports"),
    status: v.union(
      v.literal("pending"),
      v.literal("reviewed"),
      v.literal("resolved"),
      v.literal("dismissed")
    ),
    adminNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // This would typically require admin authentication
    const currentUser = await getAuthenticatedUser(ctx);
    
    const report = await ctx.db.get(args.reportId);
    if (!report) {
      throw new Error("Report not found");
    }

    await ctx.db.patch(args.reportId, {
      status: args.status,
      adminNotes: args.adminNotes,
      reviewedAt: Date.now(),
      reviewedBy: currentUser._id,
    });

    return args.reportId;
  },
});

export const getUserReports = query({
  handler: async (ctx) => {
    const currentUser = await getAuthenticatedUser(ctx);
    
    const reports = await ctx.db
      .query("reports")
      .withIndex("by_user", (q) => q.eq("userId", currentUser._id))
      .collect();

    const reportsWithPostInfo = await Promise.all(
      reports.map(async (report) => {
        const post = await ctx.db.get(report.postId);
        const reportedUser = await ctx.db.get(report.reportedUserId);
        
        return {
          ...report,
          post: post ? {
            _id: post._id,
            imageUrl: post.imageUrl,
            caption: post.caption,
          } : null,
          reportedUser: reportedUser ? {
            _id: reportedUser._id,
            username: reportedUser.username,
          } : null,
        };
      })
    );

    return reportsWithPostInfo;
  },
});

