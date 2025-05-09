import { prisma } from "@/lib/prisma";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);
    const eventType = evt.type;

    switch (eventType) {
      case "user.created": {
        const primaryEmail = evt.data.email_addresses.find(
          (email) => email.id === evt.data.primary_email_address_id
        )?.email_address;

        await prisma.user.create({
          data: {
            clerkId: evt.data.id,
            email: primaryEmail || "",
            name: [evt.data.first_name, evt.data.last_name]
              .filter(Boolean)
              .join(" "),
            image: evt.data.image_url,
            username: evt.data.username || evt.data.id,
            createdAt: new Date(evt.data.created_at),
            updatedAt: new Date(evt.data.updated_at),
            private: true,
          },
        });
        break;
      }

      case "user.updated": {
        const primaryEmail = evt.data.email_addresses.find(
          (email) => email.id === evt.data.primary_email_address_id
        )?.email_address;

        await prisma.user.update({
          where: { clerkId: evt.data.id },
          data: {
            email: primaryEmail || "",
            name: [evt.data.first_name, evt.data.last_name]
              .filter(Boolean)
              .join(" "),
            image: evt.data.image_url,
            username: evt.data.username || evt.data.id,
            updatedAt: new Date(evt.data.updated_at),
          },
        });
        break;
      }

      case "user.deleted": {
        await prisma.user.delete({
          where: { clerkId: evt.data.id },
        });
        break;
      }

      default: {
        console.log(`⚠️ Unhandled event type: ${eventType}`);
        break;
      }
    }

    return new NextResponse("Webhook received", { status: 200 });
  } catch (err) {
    console.error("❌ Error verifying webhook:", err);
    return new NextResponse("Error verifying webhook", { status: 400 });
  }
}
