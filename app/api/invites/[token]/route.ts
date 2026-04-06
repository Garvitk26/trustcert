import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Invite from "@/lib/models/Invite";
import Institution from "@/lib/models/Institution";

export async function GET(req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  await dbConnect();

  const invite = await Invite.findOne({ 
    token: token,
    usedAt: { $exists: false },
    expiresAt: { $gt: new Date() }
  });

  if (!invite) return NextResponse.json({ error: "Invite not found or expired" }, { status: 404 });

  const institution = await Institution.findById(invite.institutionId);
  if (!institution) return NextResponse.json({ error: "Institution no longer exists" }, { status: 404 });

  return NextResponse.json({
    institutionName: institution.name,
    role: invite.role,
    email: invite.email
  });
}
