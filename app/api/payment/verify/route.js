
import services from "@/lib/services.json";
export async function GET(req){
 const reference=new URL(req.url).searchParams.get("reference");
 if(!reference||!/^[A-Za-z0-9._-]{1,150}$/.test(reference))return Response.json({error:"Invalid reference"},{status:400});
 try{
  const res=await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,{headers:{Authorization:`Bearer ${process.env.PAYSTACK_SECRET_KEY}`},cache:"no-store"});
  if(!res.ok)return Response.json({error:"Paystack unavailable"},{status:502});
  const result=await res.json(),tx=result.data,service=services[tx?.metadata?.service_id];
  if(!result.status||tx?.status!=="success"||tx.reference!==reference||tx.currency!=="ZAR"||!service?.form||tx.amount!==service.amount)
   return Response.json({error:"Payment not confirmed for this consultation"},{status:403});
  return Response.json({formUrl:service.form},{headers:{"Cache-Control":"no-store"}});
 }catch(e){console.error(e);return Response.json({error:"Verification failed"},{status:500});}
}
