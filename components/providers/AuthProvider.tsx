import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { useAppError } from './ErrorProvider'

type AuthContext = {
  user: { userId?: '' }
  setUser: (user: { userId?: string }) => void
}

const AuthContext = createContext<AuthContext>({
  user: { userId: '' },
  setUser: () => {},
})

function AuthProvider({ children }: { children: React.ReactNode }): any {
  const { pathname } = useRouter()
  const { setAppError } = useAppError()
  const [user, setUser] = useState({})

  useEffect(() => {
    const getUser = async (): Promise<void> => {
      try {
        const response = await axios.get('/api/userData')
        if (response.data?.userId) {
          setUser({ userId: response.data.userId })
        }
      } catch (err) {
        if (err.response.status === 401) {
          // unauthed
          setUser({})
        } else {
          setAppError('')
        }
      }
    }
    getUser()
  }, [setAppError, pathname])

  const contextValue: AuthContext = {
    user,
    setUser: (updatedUser) => {
      setUser(updatedUser)
    },
  }

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  )
}

const useAuth = (): AuthContext => useContext(AuthContext)

export { AuthProvider, useAuth }
