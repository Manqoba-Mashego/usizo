
"use client";
import {Suspense,useEffect,useState} from "react";
import {useSearchParams} from "next/navigation";
function Verify(){
 const params=useSearchParams(),reference=params.get("reference")||params.get("trxref");
 const [state,setState]=useState({loading:true,error:"",url:""});
 useEffect(()=>{
  if(!reference){setState({loading:false,error:"Missing reference",url:""});return;}
  const controller=new AbortController();
  (async()=>{try{
   const res=await fetch(`/api/payment/verify?reference=${encodeURIComponent(reference)}`,{signal:controller.signal,cache:"no-store"});
   const data=await res.json();
   if(!res.ok||!data.formUrl)throw Error(data.error||"Verification failed");
   setState({loading:false,error:"",url:data.formUrl});window.location.replace(data.formUrl);
  }catch(e){if(e.name!=="AbortError")setState({loading:false,error:e.message,url:""});}})();
  return ()=>controller.abort();
 },[reference]);
 return <main className="min-h-screen flex items-center justify-center p-8 text-center"><div className="space-y-4">
 <h1 className="text-2xl font-bold">{state.loading?"Verifying payment…":state.error?"Verification unsuccessful":"Payment confirmed!"}</h1>
 {state.error&&<p role="alert">{state.error}. If you paid, do not pay again. Contact support with your receipt.</p>}
 {state.url&&<><p>Opening your Google Form…</p><a className="underline" href={state.url}>Open form manually</a></>}
 <a className="block underline" href="/">Home</a></div></main>;
}
export default function Page(){return <Suspense fallback={<p>Loading…</p>}><Verify/></Suspense>;}
