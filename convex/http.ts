import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { Webhook } from "svix";
import { api } from "./_generated/api";

const http = httpRouter();

http.route({
    path:"/clerk-webhook",
    method:"POST",
    handler: httpAction(async(ctx, request)=>{
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (!webhookSecret) {
        throw new Error("Missing CLERK_WEBHOOK_SECRET environment variable");
      }
        // check headers
    const svix_id = request.headers.get("svix-id");
    const svix_signature = request.headers.get("svix-signature");
    const svix_timestamp = request.headers.get("svix-timestamp");

    if (!svix_id || !svix_signature || !svix_timestamp) {
      return new Response("Error occurred -- no svix headers", {
        status: 400,
      });
    }
    const payload = await request.json();
    const body = JSON.stringify(payload);

    const wh = new Webhook(webhookSecret);
    let evt: any;
    //verify webhook
    try {
        evt = wh.verify(body, {
          "svix-id": svix_id,
          "svix-timestamp": svix_timestamp,
          "svix-signature": svix_signature,
        }) as any;
      } catch (err) {
        console.error("Error verifying webhook:", err);
        return new Response("Error occurred", { status: 400 });
      }

   })
})