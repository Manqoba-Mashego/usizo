import Email from '@/components/email'
import React from 'react'

const Page = () => {
  return (
    <Email 
        heading={"Book Your Interview Preparation Session"}
        amount={150}
        service_id={4}
    />
  )
}

export default Page