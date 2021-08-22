import { FavoriteBorder } from '@material-ui/icons'
import Alert from '@material-ui/lab/Alert'
import React from 'react'

import { useAuth } from '../components/providers/AuthProvider'
import UniTable from '../components/UniTable'

export default function Favorites(): JSX.Element {
  const { user } = useAuth()
  if (!user?.userId) {
    return (
      <Alert icon={<FavoriteBorder />} severity="info">
        Please login in order to save universities.
      </Alert>
    )
  }
  return <UniTable userId={user?.userId} isFavoritesTab />
}
