import Email from '@/components/email'
import React from 'react'

const Page = () => {
  return (
    <Email 
        heading={"Book Your CV Creation Consultation"}
        amount={100}
        service_id={3}
    />
  )
}

export default Page