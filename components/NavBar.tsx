import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import { AccountCircle, Favorite, Search } from '@material-ui/icons'
import Link from 'next/link'

import { useRouter } from 'next/router'
import axios from 'axios'
import { useAuth } from './providers/AuthProvider'
import { useAppError } from './providers/ErrorProvider'

export default function NavBar(): JSX.Element {
  const { user, setUser } = useAuth()
  const { setAppError } = useAppError()
  const { pathname } = useRouter()
  let tabValue
  switch (pathname) {
    case '/signup':
      tabValue = 2
      break
    case '/login':
      tabValue = 2
      break
    case '/favorites':
      tabValue = 1
      break
    case '/':
      tabValue = 0
      break
    default:
      tabValue = 0
      break
  }
  const handleLogoutClick = async () => {
    try {
      await axios.post('/api/logout')
      setUser({})
    } catch (err) {
      setAppError(err)
    }
  }
  return (
    <>
      <AppBar position="static">
        <Tabs
          variant="fullWidth"
          value={tabValue}
          aria-label="nav tabs"
          centered
        >
          <Link href="/">
            <Tab icon={<Search />} label="Search Unis" />
          </Link>
          <Link href="/favorites">
            <Tab icon={<Favorite color="secondary" />} label="View Favorites" />
          </Link>
          <Link href={user?.userId ? '#' : '/login'}>
            <Tab
              onClick={user?.userId ? () => handleLogoutClick() : () => void 0}
              icon={<AccountCircle />}
              label={user?.userId ? 'Log out' : 'Log in'}
            />
          </Link>
        </Tabs>
      </AppBar>
    </>
  )
}
