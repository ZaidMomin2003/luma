import { initializeApp, getApps } from 'firebase/app'
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signInWithEmailLink,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Initialize Firebase (prevent double-init in dev)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
const auth = getAuth(app)

const googleProvider = new GoogleAuthProvider()
const githubProvider = new GithubAuthProvider()

// ─── Auth Functions ──────────────────────────────────────────

export async function signInWithGoogle() {
  return signInWithPopup(auth, googleProvider)
}

export async function signInWithGithub() {
  return signInWithPopup(auth, githubProvider)
}

export async function sendMagicLink(email: string) {
  const actionCodeSettings = {
    url: `${window.location.origin}/auth/callback`,
    handleCodeInApp: true,
  }
  await sendSignInLinkToEmail(auth, email, actionCodeSettings)
  window.localStorage.setItem('emailForSignIn', email)
}

export async function completeMagicLinkSignIn() {
  if (!isSignInWithEmailLink(auth, window.location.href)) return null
  let email = window.localStorage.getItem('emailForSignIn')
  if (!email) {
    email = window.prompt('Please provide your email for confirmation') || ''
  }
  const result = await signInWithEmailLink(auth, email, window.location.href)
  window.localStorage.removeItem('emailForSignIn')
  return result
}

export async function logout() {
  return signOut(auth)
}

export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback)
}

export async function getIdToken() {
  const user = auth.currentUser
  if (!user) return null
  return user.getIdToken()
}

export { auth, type User }
