import { Metadata } from 'next'
import LoginForm from './login-form'

export const metadata: Metadata = { title: 'Log in — Luma' }

export default function LoginPage() {
  return <LoginForm />
}
