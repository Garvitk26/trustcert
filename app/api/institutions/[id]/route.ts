import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Institution from "@/lib/models/Institution";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();
  
  const institution = await Institution.findOne({
    _id: id,
    $or: [{ ownerId: session.user.id }, { "members.userId": session.user.id }],
    deletedAt: { $exists: false }
  });

  if (!institution) return NextResponse.json({ error: "Institution not found" }, { status: 404 });

  return NextResponse.json(institution);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  await dbConnect();

  // Check admin+ access
  const institution = await Institution.findOne({
    _id: id,
    members: { $elemMatch: { userId: session.user.id, role: { $in: ["owner", "admin"] } } }
  });

  if (!institution) return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });

  // Only $set fields that were actually provided, to avoid wiping fields like walletAddress
  const updateFields: Record<string, any> = {};
  if (body.name !== undefined) updateFields.name = body.name;
  if (body.accentColor !== undefined) updateFields.accentColor = body.accentColor;
  if (body.certPrefix !== undefined) updateFields.certPrefix = body.certPrefix;
  if (body.walletAddress !== undefined) updateFields.walletAddress = body.walletAddress;
  if (body.verifiedDomain !== undefined) updateFields.verifiedDomain = body.verifiedDomain;

  const updated = await Institution.findByIdAndUpdate(
    id,
    { $set: updateFields },
    { new: true }
  );

  return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();

  // Only owner can delete (soft delete)
  const institution = await Institution.findOne({
    _id: id,
    ownerId: session.user.id
  });

  if (!institution) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  await Institution.findByIdAndUpdate(id, { $set: { deletedAt: new Date() } });

  return NextResponse.json({ success: true });
}
