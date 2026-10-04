"use client";
import { useEffect } from 'react';

import CVSection from '@/components/cvSection'
import Hero from '@/components/hero'
import CoverLetterSection from '@/components/coverLetterSection'
import Services from '@/components/services'
import React from 'react'
import InterviewPrepSection from '@/components/interviewPrepSection';
import Footer from '@/components/footer';
import Pricing from '@/components/pricing';
import FounderSection from '@/components/founderSection';

const Page = () => {

  
  useEffect(() => {
  const hash = window.location.hash.replace("#", "");
  if (hash) {
    const el = document.getElementById(hash);
    el?.scrollIntoView({ behavior: "smooth" });
  }
}, []);
  return (
    <div>
      <Hero />
      <Services />
      <Pricing />
      <CVSection />
      <InterviewPrepSection />
      <CoverLetterSection />
      <FounderSection />
      <Footer />
    </div>
  )
}

export default Page