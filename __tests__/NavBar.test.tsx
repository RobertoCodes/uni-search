import React from 'react'
import { act, fireEvent, render, screen } from '@testing-library/react'
import * as nextRouter from 'next/router'
import axios from 'axios'
import NavBar from '../components/NavBar'
import { useAuth } from '../components/providers/AuthProvider'

jest.mock('axios')

jest.mock('../components/providers/AuthProvider')
jest.mock('next/router')
jest.mock(
  'next/link',
  () =>
    ({ children }) =>
      children
)

nextRouter.useRouter.mockImplementation(() => ({ route: '/' }))
nextRouter.Router = { push: () => {} }

describe('Navbar', () => {
  it('renders proper tabs for guest user', () => {
    useAuth.mockImplementationOnce(() => ({
      user: {},
      setUser: () => {},
    }))
    render(<NavBar />)
    screen.getByText('Search Unis')
    screen.getByText('View Favorites')
    screen.getByText('Log in')
  })
  it('renders proper tabs for loggedIn user', () => {
    useAuth.mockImplementationOnce(() => ({
      user: { userId: '34' },
      setUser: () => {},
    }))
    render(<NavBar />)
    screen.getByText('Search Unis')
    screen.getByText('View Favorites')
    screen.getByText('Log out')
  })
  it('calls api route on logout click', async () => {
    useAuth.mockImplementationOnce(() => ({
      user: { userId: '34' },
      setUser: () => {},
    }))
    render(<NavBar />)
    const logoutButton = screen.getByText('Log out')
    act(() => {
      fireEvent.click(logoutButton)
    })
    expect(axios.post).toHaveBeenCalledWith('/api/logout')
  })
})
