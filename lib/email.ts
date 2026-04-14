import { Resend } from "resend";

// Lazy instantiate Resend to avoid build-time errors when API key is missing
const getResend = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey && process.env.NODE_ENV === "production") {
    console.warn("RESEND_API_KEY is missing in production.");
  }
  return new Resend(apiKey || "re_123");
};

export async function sendIssuanceEmail(
  to: string, 
  studentName: string, 
  courseName: string, 
  verificationUrl: string
) {
  try {
    const resend = getResend();
    const { data, error } = await resend.emails.send({
      from: "TrustCert <notifications@trustcert.app>",
      to: [to],
      subject: `Your Certificate for ${courseName} is Ready!`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background-color: #08080f; color: #f1f5f9; padding: 40px; border-radius: 20px; border: 1px solid #f59e0b20;">
          <h1 style="color: #f59e0b; margin-bottom: 20px;">Congratulations, ${studentName}!</h1>
          <p style="font-size: 16px; line-height: 1.6; color: #94a3b8;">
            Your academic credential for <strong>${courseName}</strong> has been successfully issued on the Stellar blockchain.
          </p>
          <div style="margin: 30px 0; padding: 20px; background-color: #0d0d1f; border-radius: 12px; border: 1px solid #f59e0b30; text-align: center;">
            <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background: linear-gradient(to right, #f59e0b, #f97316); color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">
              View & Verify Certificate
            </a>
          </div>
          <p style="font-size: 14px; color: #475569;">
            You can also log in to your <a href="https://trustcert.app/student/portal" style="color: #f59e0b;">Student Portal</a> to manage all your blockchain credentials.
          </p>
          <hr style="border: 0; border-top: 1px solid #1a1a3e; margin: 30px 0;" />
          <p style="font-size: 12px; color: #475569; text-align: center;">
            TrustCert — The Future of Academic Integrity
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Email send failed:", err);
    return { success: false, error: err };
  }
}
