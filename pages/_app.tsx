import '../styles/globals.css'
import React from 'react'
import type { AppProps } from 'next/app'
import { AuthProvider } from '../components/providers/AuthProvider'
import { ErrorProvider } from '../components/providers/ErrorProvider'
import Layout from '../components/Layout'

function MyApp({ Component, pageProps }: AppProps): React.ReactNode {
  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles)
    }
  }, [])
  return (
    <AuthProvider>
      <ErrorProvider>
        <style jsx global>{`
          @font-face {
            font-family: 'Roboto';
          }
        `}</style>
        <Layout>
          <Component {...pageProps} />{' '}
        </Layout>
      </ErrorProvider>
    </AuthProvider>
  )
}

export default MyApp
