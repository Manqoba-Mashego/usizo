import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendDownloadEmail(email, token) {
  const link = `${process.env.NEXT_PUBLIC_BASE_URL}/cover-letter-template/download?token=${token}`;

  const { data, error } = await resend.emails.send({
    from: "USIZO Services <onboarding@resend.dev>",
    to: email,
    subject: "Your Cover Letter Template",
    html: `
      <h2>Your download is ready</h2>
      <p>Click below to download your template:</p>
      <a href="${link}">${link}</a>
      <p>This link expires in 10 minutes.</p>
    `,
  });
  if (error || !data?.id) throw new Error(error?.message || "Email provider did not confirm acceptance");
}