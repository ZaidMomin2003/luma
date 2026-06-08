import { Metadata } from 'next'
import SignupForm from './signup-form'

export const metadata: Metadata = { title: 'Sign up — Luma' }

export default function SignupPage() {
  return <SignupForm />
}
