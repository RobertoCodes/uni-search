import React from 'react'
import Link from 'next/link'

export default function Custom404(): JSX.Element {
  return (
    <>
      <h1>404 - Page Not Found</h1>
      <Link href="/">
        <a>Return to home</a>
      </Link>
    </>
  )
}
