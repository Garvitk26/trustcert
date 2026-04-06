import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Invite from "@/lib/models/Invite";
import Institution from "@/lib/models/Institution";

export async function POST(req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();

  const invite = await Invite.findOne({ 
    token: token,
    usedAt: { $exists: false },
    expiresAt: { $gt: new Date() }
  });

  if (!invite) return NextResponse.json({ error: "Invite not found or expired" }, { status: 404 });

  // Update institution members
  await Institution.findByIdAndUpdate(invite.institutionId, {
    $push: { members: { userId: session.user.id, role: invite.role } }
  });

  // Mark invite as used
  await Invite.findByIdAndUpdate(invite._id, {
    $set: { usedAt: new Date() }
  });

  return NextResponse.json({ success: true, institutionId: invite.institutionId });
}
