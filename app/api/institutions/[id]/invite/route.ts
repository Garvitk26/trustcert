import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Institution from "@/lib/models/Institution";
import Invite from "@/lib/models/Invite";
import crypto from "crypto";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { email, role } = await req.json();
  if (!email || !role) return NextResponse.json({ error: "Email and role are required" }, { status: 400 });

  await dbConnect();

  // Validate admin+ access
  const institution = await Institution.findOne({
    _id: id,
    members: { $elemMatch: { userId: session.user.id, role: { $in: ["owner", "admin"] } } }
  });

  if (!institution) return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 72);

  await Invite.create({
    institutionId: id,
    email,
    role,
    token,
    expiresAt,
    createdBy: session.user.id
  });

  console.log(`\n\n[TRUSTCERT] INVITE URL: ${process.env.NEXTAUTH_URL}/invite/${token}\n\n`);

  return NextResponse.json({ success: true });
}
