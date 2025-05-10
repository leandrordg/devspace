import { prisma } from "@/lib/prisma";
import { DeletedObjectJSON, UserJSON } from "@clerk/nextjs/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest, NextResponse } from "next/server";

function extractUserInfo(data: UserJSON) {
  const email =
    data.email_addresses.find(
      (email) => email.id === data.primary_email_address_id
    )?.email_address || "";

  const name = [data.first_name, data.last_name].filter(Boolean).join(" ");

  return { email, name };
}

async function handleUserCreated(data: UserJSON) {
  const { email, name } = extractUserInfo(data);

  await prisma.user.create({
    data: {
      clerkId: data.id,
      name,
      email,
      image: data.image_url,
      username: data.username || data.id,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      private: true,
    },
  });
}

async function handleUserUpdated(data: UserJSON) {
  const { email, name } = extractUserInfo(data);

  await prisma.user.update({
    where: { clerkId: data.id },
    data: {
      name,
      email,
      image: data.image_url,
      username: data.username || data.id,
      updatedAt: new Date(data.updated_at),
    },
  });
}

async function handleUserDeleted({ id }: DeletedObjectJSON) {
  await prisma.user.delete({ where: { clerkId: id } });
}

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);

    switch (evt.type) {
      case "user.created":
        await handleUserCreated(evt.data);
        break;

      case "user.updated":
        try {
          await handleUserUpdated(evt.data);
        } catch (error) {
          console.error("Error updating user:", error);
          return new NextResponse("Error updating user", { status: 500 });
        }
        break;

      case "user.deleted":
        try {
          await handleUserDeleted(evt.data);
        } catch (error) {
          console.error("Error deleting user:", error);
          return new NextResponse("Error deleting user", { status: 500 });
        }
        break;

      default:
        console.log(`⚠️ Unhandled event type: ${evt.type}`);
        break;
    }

    return new NextResponse("Webhook received", { status: 200 });
  } catch (err) {
    console.error("❌ Error verifying webhook:", err);
    return new NextResponse("Error verifying webhook", { status: 400 });
  }
}
