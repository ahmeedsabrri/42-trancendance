import { ReactNode } from 'react'

interface AuthLayoutProps {
  children: ReactNode
  title: string
}

export default function AuthLayout({ children, title }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 rounded-xl backdrop-blur-lg bg-white bg-opacity-10 shadow-lg">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">{title}</h1>
        {children}
      </div>
    </div>
  )
}
