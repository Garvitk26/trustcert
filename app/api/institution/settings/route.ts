import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Institution from "@/lib/models/Institution";
import User from "@/lib/models/User";
import crypto from "crypto";

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "institution") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, slug, accentColor, certPrefix, generateKey, verifiedDomain, walletAddress } = body;

    await dbConnect();

    const institution = await Institution.findOne({ ownerId: (session.user as any).id });
    if (!institution) {
      return NextResponse.json({ error: "Institution not found" }, { status: 404 });
    }

    // 1. Metadata updates
    if (name) institution.name = name;
    if (slug) institution.slug = slug;
    if (accentColor) institution.accentColor = accentColor;
    if (verifiedDomain) institution.verifiedDomain = verifiedDomain;
    if (walletAddress) institution.walletAddress = walletAddress;
    if (certPrefix) {
       institution.metadata = { 
          ...institution.metadata, 
          certPrefix: certPrefix.toUpperCase() 
       };
       institution.certPrefix = certPrefix.toUpperCase();
    }

    // 2. Headless API Key Generation (Secret)
    let rawKey = null;
    if (generateKey) {
       const crypto = await import("crypto");
       rawKey = `tc_live_${crypto.randomBytes(24).toString("hex")}`;
       // We store the hash
       const hash = crypto.createHash("sha256").update(rawKey).digest("hex");
       institution.secretKeyHash = hash;
       
       // Record in Audit Log
       const { logAction } = await import("@/lib/audit");
       logAction(institution._id.toString(), (session.user as any).id, "GENERATE_API_KEY", "API_KEY").catch(e => console.error(e));

       // Temporary metadata for the ONCE view
       institution.metadata = {
          ...institution.metadata,
          secretKey: rawKey,
          keyGeneratedAt: new Date()
       };
    }

    await institution.save();

    return NextResponse.json({ 
       success: true, 
       message: "Organization configuration effectively synchronized.",
       institution: {
          ...institution.toObject(),
          // include the raw key only if just generated
          metadata: {
             ...institution.metadata,
             secretKey: rawKey
          }
       }
    });

  } catch (error: any) {
    console.error("Settings Update Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "institution") {
       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const institution = await Institution.findOne({ ownerId: (session.user as any).id }).lean();
    if (!institution) {
       return NextResponse.json({ error: "Institution not found" }, { status: 404 });
    }

    return NextResponse.json({
       ...institution,
       metadata: institution.metadata || {},
       // Mask the secret key for safety
       secretKeyMasked: (institution.metadata as any)?.secretKey 
          ? `${(institution.metadata as any).secretKey.substring(0, 10)}...` 
          : null
    });
  } catch (error: any) {
    console.error("Settings GET error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
