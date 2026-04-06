import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Certificate from "@/lib/models/Certificate";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Missing Certificate ID" }, { status: 400 });
    }

    await dbConnect();

    const certificate = await Certificate.findOne({ certId: id }).populate("institutionId");

    if (!certificate) {
      return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
    }

    const institution = certificate.institutionId as any;

    // Clean JSON response for third-party integrations
    const response = {
      valid: certificate.status === "issued",
      cert_id: certificate.certId,
      recipient: certificate.recipientName,
      course: certificate.courseTitle,
      institution: institution.name,
      stellar_tx: certificate.txHash,
      issued_at: certificate.issueDate,
      status: certificate.status,
      revocation_reason: certificate.revocationReason || null,
      verification_url: `${process.env.NEXTAUTH_URL}/verify/${certificate.certId}`
    };

    return NextResponse.json(response, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });

  } catch (error: any) {
    console.error("Public API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
