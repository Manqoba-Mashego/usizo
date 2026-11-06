import Email from '@/components/email'
import React from 'react'

const Page = () => {
  return (
    <Email 
        heading={"Book Your CV Revamp Consultation"}
        amount={80}
        service_id={2}
    />
  )
}

export default Page