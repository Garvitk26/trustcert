import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Certificate from "@/lib/models/Certificate";
import Institution from "@/lib/models/Institution";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ wallet: string }> }
) {
  try {
    const { wallet } = await params;
    await dbConnect();

    // Fetch public certificates linked to this wallet
    const certificates = await Certificate.find({
      linkedWallet: wallet,
      status: "issued"
      // Note: Add visibility check once the portal allows toggling it
      // visibility: "public" 
    }).populate("institutionId", "name slug accentColor");

    if (!certificates) {
      return NextResponse.json([], { status: 200 });
    }

    // Calculate Trust Score (Unique Institutions)
    const uniqueInstitutions = new Set(
      certificates.map((c: any) => c.institutionId?._id.toString())
    );

    return NextResponse.json({
      certificates,
      stats: {
        totalCerts: certificates.length,
        uniqueIssuers: uniqueInstitutions.size,
        trustScore: uniqueInstitutions.size * 10 // Baseline logic
      }
    });

  } catch (error: any) {
    console.error("Public Profile API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
