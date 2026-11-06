import fs from "fs";
import path from "path";
import crypto from "crypto";
import { redis } from "@/lib/redis";
import { ratelimit } from "@/lib/rateLimit";
import { sendDownloadEmail } from "@/lib/email";

const TTL = 60 * 60 * 24 * 365;
const LINK_TTL = 60 * 10;
const redirect = (token) => new Response(null, {
  status: 302,
  headers: {
    Location: `/cover-letter-template/download?token=${encodeURIComponent(token)}`,
    "Cache-Control": "no-store",
  },
});

export async function GET(req) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anonymous";
    const { success } = await ratelimit.limit(ip);
    if (!success) return new Response("Too many requests", { status: 429 });

    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");
    const reference = searchParams.get("reference") || searchParams.get("trxref");

    if (token) {
      if (!/^[a-f0-9]{64}$/.test(token)) return new Response("Invalid link", { status: 403 });
      const key = `download:${token}`;
      const remaining = await redis.eval(
        `local raw = redis.call('GET', KEYS[1])
         if not raw then return 0 end
         local data = cjson.decode(raw)
         local count = tonumber(data.downloads or 0)
         if count >= 3 then return 0 end
         data.downloads = count + 1
         if data.downloads >= 3 then redis.call('DEL', KEYS[1])
         else redis.call('SET', KEYS[1], cjson.encode(data), 'KEEPTTL') end
         return 1`, [key], []
      );
      if (remaining !== 1) return new Response("Invalid, expired, or exhausted link", { status: 403 });
      const file = fs.readFileSync(path.join(process.cwd(), "public", "templates", "cover-letter-template.docx"));
      return new Response(file, { headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": "attachment; filename=cover-letter-template.docx",
        "Cache-Control": "no-store",
      }});
    }

    if (!reference || !/^[a-zA-Z0-9._-]{1,150}$/.test(reference)) {
      return Response.json({ error: "Invalid or missing payment reference" }, { status: 400 });
    }
    const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
      cache: "no-store",
    });
    if (!verifyRes.ok) return new Response("Payment verification unavailable", { status: 502 });
    const verified = await verifyRes.json();
    const payment = verified.data;
    if (!verified.status || payment?.status !== "success" || payment?.reference !== reference ||
        payment?.amount !== 5000 || payment?.currency !== "ZAR" ||
        (payment?.metadata?.service_id != null && Number(payment.metadata.service_id) !== 0)) {
      return new Response("Payment not verified for this product", { status: 403 });
    }
    const email = payment.customer?.email;
    if (!email) return new Response("Payment has no customer email. Contact support.", { status: 422 });

    const key = `fulfillment:template:${reference}`;
    const newToken = crypto.randomBytes(32).toString("hex");
    const claimed = await redis.set(key, { token: newToken, email, status: "processing" }, { nx: true, ex: TTL });
    const record = claimed ? { token: newToken, email, status: "processing" } : await redis.get(key);
    if (!record) return new Response("Fulfillment unavailable. Contact support.", { status: 503 });

    if (claimed) {
      await redis.set(`download:${newToken}`, { email, downloads: 0 }, { ex: LINK_TTL });
      try {
        await sendDownloadEmail(email, newToken);
        await redis.set(key, { token: newToken, email, status: "sent" }, { xx: true, ex: TTL });
      } catch (error) {
        console.error("Template fulfillment email requires reconciliation:", reference, error);
        await redis.set(key, { token: newToken, email, status: "needs_review" }, { xx: true, ex: TTL });
        return new Response("Payment confirmed, but delivery needs support review. Do not pay again.", { status: 503 });
      }
    } else if (record.status !== "sent") {
      return new Response("Payment confirmed. Delivery is processing or needs support review. Do not pay again.", { status: 202 });
    }
    return redirect(record.token);
  } catch (error) {
    console.error("Download handler failed:", error);
    return new Response("Unable to process request. If paid, do not pay again; contact support.", { status: 500 });
  }
}
