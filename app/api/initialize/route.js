import services from "@/lib/services.json";
export async function POST(req) {
    try {
        const { email, service_id } = await req.json();

        const parsedServiceId = Number(service_id);
        const service = services[parsedServiceId];

        if (!Number.isInteger(parsedServiceId) || !service || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return Response.json({ error: "Invalid email or service" }, { status: 400 });
        if (!process.env.PAYSTACK_SECRET_KEY || !process.env.NEXT_PUBLIC_BASE_URL) return Response.json({ error: "Payment configuration missing" }, { status: 500 });
        const callback_url = new URL(service_id === 0 ? "/cover-letter-template/verify" : "/payment/verify", process.env.NEXT_PUBLIC_BASE_URL).toString();
        const res = await fetch("https://api.paystack.co/transaction/initialize", { method: "POST", headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`, "Content-Type": "application/json" }, body: JSON.stringify({ email, amount: service.amount, currency: "ZAR", callback_url, metadata: { service_id: parsedServiceId } }), cache: "no-store" });
        const data = await res.json();
        if (!res.ok || !data.status || !data.data?.authorization_url) return Response.json({ error: "Unable to initialize payment" }, { status: 502 });
        return Response.json({ data: { authorization_url: data.data.authorization_url } });
    } catch (e) { console.error(e); return Response.json({ error: "Payment initialization failed" }, { status: 500 }); }
}
