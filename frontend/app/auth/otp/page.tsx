'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AuthLayout from '../components/AuthLayout'

export default function OTP() {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const router = useRouter()

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(parseInt(element.value))) return false

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))])

    // Focus next input
    if (element.nextSibling && element.value !== '') {
      (element.nextSibling as HTMLInputElement).focus()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const otpValue = otp.join('')
    // Implement your OTP verification logic here
    console.log('Verifying OTP:', otpValue)
    // Redirect to dashboard or home page after successful verification
    // router.push('/dashboard')
  }

  return (
    <AuthLayout title="OTP Verification">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex justify-between">
          {otp.map((data, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={data}
              onChange={(e) => handleChange(e.target, index)}
              className="w-12 h-12 text-center text-2xl bg-white bg-opacity-20 border border-white border-opacity-30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          ))}
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          Verify OTP
        </button>
      </form>
    </AuthLayout>
  )
}

