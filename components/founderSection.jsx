"use client";
import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Mail } from 'lucide-react'
import Reveal from './reveal'

const FounderSection = () => {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <div id='about' className='scroll-mt-15 py-24 w-[90%] max-w-6xl mx-auto'>
      <Reveal>
        <p className='text-[#faa329] font-semibold text-center'>MEET THE FOUNDER</p>
        <p className='font-playfair text-3xl md:text-[48px] text-center font-black text-[#0d0729] mb-3'>The Person Behind USIZO</p>
      </Reveal>

      <Reveal className={"mt-15"}>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center max-w-5xl mx-auto'>
          <div className='relative w-full max-w-sm mx-auto'>
            <div className='absolute -bottom-4 -right-4 w-full h-full rounded-2xl border-2 border-[#faa329]'></div>
            <div className='relative aspect-4/5 rounded-2xl overflow-hidden border border-gray-300 bg-[#162B4E]'>
              {imageFailed ? (
                <div className='absolute inset-0 flex items-center justify-center'>
                  <span className='font-playfair text-7xl font-black text-[#faa329]'>ZS</span>
                </div>
              ) : (
                <Image
                  src='/zinzi.jpeg'
                  alt='Zindzi Singwane, founder of USIZO'
                  fill
                  sizes='(min-width: 768px) 384px, 90vw'
                  className='object-cover'
                  onError={() => setImageFailed(true)}
                />
              )}
            </div>
          </div>

          <div className='flex flex-col gap-5'>
            <div>
              <h3 className='font-playfair text-3xl font-bold text-[#0d0729]'>Zindzi Nsingwana</h3>
            </div>
            <p className='text-gray-600 text-lg'>Zinzi is a Career Guidance Coach and Specialist who has invested in ongoing professional development to sharpen the skills she brings to every client relationship. What started in 2021 as a side hustle to earn extra income after graduating university has grown into a calling.</p>
            <p className='text-gray-600 text-lg'>The passion came later — when Zinzi returned to Nkomazi, Mpumalanga, the community where she was born, and saw the real shape of the unemployment problem there. It wasn't only a shortage of opportunities. It was a lack of employability skills, and CVs that failed to tell a candidate's story before they ever reached a recruiter. That gap became the founding purpose of USIZO Services.</p>
            <p className='text-gray-600 text-lg'>Zinzi's work is rooted in care, passion, and a deep belief in levelling the playing field for the youth, professionals, and broader community of Nkomazi. Through affordable, accessible services, she's committed to helping every client walk into their next opportunity with the strongest possible chance of getting the job.</p>   
          </div>
        </div>
      </Reveal>
    </div>
  )
}

export default FounderSection