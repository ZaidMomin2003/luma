'use client'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { onAuthChange, type User } from '@/lib/firebase'
import { supabase } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  loading: boolean
  dbUser: DbUser | null
}

interface DbUser {
  id: string
  firebase_uid: string
  email: string
  name: string | null
  company: string | null
  plan: 'free' | 'starter' | 'pro' | 'enterprise'
  avatar_url: string | null
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  dbUser: null,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [dbUser, setDbUser] = useState<DbUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      setUser(firebaseUser)

      if (firebaseUser) {
        // Upsert user in Supabase
        const { data, error } = await supabase
          .from('users')
          .upsert(
            {
              firebase_uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: firebaseUser.displayName || null,
              avatar_url: firebaseUser.photoURL || null,
            },
            { onConflict: 'firebase_uid' }
          )
          .select()
          .single()

        if (data && !error) {
          setDbUser(data as DbUser)
        }
      } else {
        setDbUser(null)
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, dbUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
