import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Certificate from "@/lib/models/Certificate";
import Institution from "@/lib/models/Institution";
import { sendIssuanceEmail } from "@/lib/email";
import { logAction } from "@/lib/audit";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "institution") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { certId, certIds, signedXdr } = await req.json();
    const idsToConfirm: string[] = certIds || (certId ? [certId] : []);

    if (!idsToConfirm.length || !signedXdr) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await dbConnect();

    // 1. Submit to Stellar Ledger
    let txHash: string;
    try {
      const { server: horizonServer } = await import("@/lib/stellar");
      const { Transaction, Networks } = await import("@stellar/stellar-sdk");
      
      const tx = new Transaction(signedXdr, Networks.TESTNET);
      const result = await horizonServer.submitTransaction(tx);
      txHash = result.hash;
    } catch (stellarErr: any) {
      console.error("Stellar Submission Error:", stellarErr);
      return NextResponse.json({ 
        error: "Blockchain submission failed", 
        details: stellarErr.response?.data || stellarErr.message 
      }, { status: 502 });
    }

    // 2. Confirm in MongoDB
    const certificates = await Certificate.find({ 
      _id: { $in: idsToConfirm }, 
      status: "pending" 
    });

    if (!certificates.length) {
      return NextResponse.json({ error: "No pending certificates found for the provided IDs" }, { status: 404 });
    }

    // Update all matching certificates
    await Certificate.updateMany(
      { _id: { $in: idsToConfirm }, status: "pending" },
      { $set: { status: "issued", txHash } }
    );

    // Trigger Email Notifications (parallel)
    for (const cert of certificates) {
      const verificationUrl = `${process.env.NEXTAUTH_URL}/verify/${cert.certId}`;
      sendIssuanceEmail(
        cert.recipientEmail,
        cert.recipientName,
        cert.courseTitle,
        verificationUrl
      ).catch(err => console.error(`Email error for ${cert.certId}:`, err));
    }

    // 3. Record Audit Log
    const institution = await Institution.findOne({ ownerId: (session.user as any).id });
    if (institution) {
      logAction(
        institution._id.toString(),
        (session.user as any).id,
        "ISSUE_CERT",
        idsToConfirm.join(", "),
        { count: certificates.length, txHash }
      ).catch(err => console.error("Audit log failed:", err));
    }

    return NextResponse.json({
      success: true,
      message: `${certificates.length} certificates confirmed and students notified.`,
      confirmedCount: certificates.length,
      txHash
    });

  } catch (error: any) {
    console.error("Confirmation API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "institution") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { issuer, certId, certHash, studentWallet } = await req.json();

    if (!issuer || !certId || !certHash) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { buildIssuanceTransaction } = await import("@/lib/stellar");
    const xdr = await buildIssuanceTransaction(issuer, studentWallet || "", certHash);

    return NextResponse.json({ success: true, xdr });

  } catch (error: any) {
    console.error("XDR Build Error:", error);
    return NextResponse.json({ error: "Failed to build transaction" }, { status: 500 });
  }
}
