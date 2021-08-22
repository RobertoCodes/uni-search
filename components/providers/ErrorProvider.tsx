import React, { createContext, useState, useContext } from 'react'

const DEFAULT_ERROR_MESSAGE =
  'There was an error processing your request. Please try again.'

type ErrorContext = {
  appError: string
  setAppError: (message?: string) => void
  removeAppError: () => void
}

const ErrorContext = createContext<ErrorContext>({
  appError: '',
  setAppError: () => {},
  removeAppError: () => {},
})

function ErrorProvider({ children }: { children: React.ReactNode }): any {
  const [appError, setAppError] = useState('')

  const contextValue: ErrorContext = {
    appError,
    setAppError: (message?: string) =>
      setAppError(message || DEFAULT_ERROR_MESSAGE),
    removeAppError: () => setAppError(''),
  }

  return (
    <ErrorContext.Provider value={contextValue}>
      {children}
    </ErrorContext.Provider>
  )
}
const useAppError = (): ErrorContext => useContext(ErrorContext)

export { ErrorProvider, useAppError }
