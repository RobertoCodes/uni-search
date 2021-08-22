import React from 'react'

import { useAuth } from '../components/providers/AuthProvider'
import UniTable from '../components/UniTable'

export default function Search() {
  const { user } = useAuth()
  return <UniTable userId={user?.userId} />
}
