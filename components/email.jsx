"use client";
import Reveal from '@/components/reveal';
import {ArrowRight, Mail, MoveLeft, Shield } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'

const Email = ({heading, amount, service_id}) => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const initializePayment = async (e) => {
        e.preventDefault();
        setLoading(true);

        setError("");
        try {
          const res=await fetch("/api/initialize",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,service_id})});
          const data=await res.json();
          if(!res.ok||!data.data?.authorization_url)throw Error(data.error||"Payment unavailable");
          window.location.assign(data.data.authorization_url);
        } catch(e) {
          setError(e.message||"Network error");setLoading(false);
        }
    };
  return (
    <Reveal>
        <div className='flex items-center justify-center w-full h-screen text-center '>
            <div>
                <h1 className='font-serif text-[32px] font-black text-[#0d0729] mb-3'>{heading}</h1>
                <p className='text-gray-600'>Enter your email to proceed to payment (R{amount})</p>
                
                <form onSubmit={initializePayment} className='border-gray-200 border rounded-2xl text-left mt-10 px-8 md:px-10 py-5 md:py-7 bg-white shadow-lg w-[90%] mx-auto md:max-w-3xl'>
                    <label className='font-semibold text-sm'>Email Address</label>
                    <div className='flex gap-3 items-center border border-gray-200 px-3 py-2 rounded-lg bg-[#e3e3e32f] my-2 focus-within:border-[#faa329] focus-within:border-2'>
                        <Mail size={17 } className='text-gray-400'/> 
                        <input type='email' onChange={(e) => setEmail(e.target.value)} placeholder='example@gmail.com' className='border-none outline-none text-sm w-full' required />
                    </div>
                    {error && <p role="alert" className="text-red-600 text-sm">{error}</p>}
                    <p className='text-gray-500 text-xs'>Your receipt will be sent to this email</p>
                    <button type='submit' disabled={loading} className={`shadow-[0_4px_10px_rgba(230,156,29,0.18),0_0_4px_rgba(230,156,29,0.15)] flex mx-auto items-center justify-center transition-all duration-300 py-3 text-sm rounded-xl gap-2 font-semibold w-full mt-6 ${loading ? "bg-gray-300 text-gray-500 cursor-not-allowed": "bg-[#e69c1d] text-[#0F2A4A] cursor-pointer hover:bg-[#e6b71d]"}`}>
                        {loading ? (
                            <>
                                <span className="animate-spin w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full"></span>
                                <span>Redirecting...</span>
                            </>
                        ) : (
                            <>
                                <span>Continue to Payment</span>
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                    <p className='flex gap-2 text-gray-500 w-full items-center justify-center mt-4 text-xs'>
                        <Shield size={15}/>
                        <span>Your information is secure</span>
                    </p>
                </form>
                <Link href={"/"} className='flex justify-center '>
                    <p className='flex items-center font-semibold gap-2 hover:border-b hover:text-black  text-gray-500 mt-6 text-sm w-fit justify-center'>
                        <MoveLeft  size={15}/> 
                        <span>Back to services</span>
                    </p>
                </Link>
            </div>
        </div>
    </Reveal>
  )
}

export default Email