import React from 'react'
import { act, fireEvent, render, screen, within } from '@testing-library/react'

import * as nextRouter from 'next/router'
import axios from 'axios'
import { mockedUnisResponse } from '../__mocks__/mocks'
import UniTable from '../components/UniTable'

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

describe('UniTable', () => {
  it('fetches universities', () => {
    render(<UniTable userId="34" />)
    expect(axios.get).toHaveBeenLastCalledWith(
      'api/unis?userId=34&name=&country=&rowsPerPage=25&page=0'
    )
  })
  it('fetches user favorites', () => {
    render(<UniTable isFavoritesTab userId="34" />)
    expect(axios.get).toHaveBeenLastCalledWith(
      'api/favorites?userId=34&name=&country=&rowsPerPage=25&page=0'
    )
  })
  it('fetches with name query param on search', () => {
    const { container } = render(<UniTable userId="34" />)
    const searchInput = container.querySelector('input[type="text"]')
    act(() => {
      fireEvent.change(searchInput, { target: { value: 'maryland' } })
    })
    act(() => {
      fireEvent.click(screen.getByRole('submitsearch'))
    })
    expect(axios.get).toHaveBeenLastCalledWith(
      'api/unis?userId=34&name=maryland&country=&rowsPerPage=25&page=0'
    )
  })
  it('sets country query param on dropdown select', () => {
    const { getByRole } = render(<UniTable userId="34" />)
    // material-ui makes it very hard to simulate a select onChange!
    fireEvent.mouseDown(getByRole('button'))
    const listbox = within(getByRole('listbox'))

    act(() => {
      fireEvent.click(listbox.getByText(/canada/i))
    })
    expect(axios.get).toHaveBeenLastCalledWith(
      'api/unis?userId=34&name=&country=Canada&rowsPerPage=25&page=0'
    )
  })
  it('renders the unis returned from api call', async () => {
    axios.get.mockResolvedValue({ data: mockedUnisResponse })
    render(<UniTable />)
    await screen.findByText(mockedUnisResponse.unis[0].name)
    await screen.findByText(mockedUnisResponse.unis[1].name)
    await screen.findByText(mockedUnisResponse.unis[2].name)
    await screen.findByText(mockedUnisResponse.unis[0].country)
    await screen.findByText(mockedUnisResponse.unis[1].country)
    await screen.findByText(mockedUnisResponse.unis[2].country)
    await screen.findByText(mockedUnisResponse.unis[0].url.split('://')[1])
    await screen.findByText(mockedUnisResponse.unis[1].url.split('://')[1])
    await screen.findByText(mockedUnisResponse.unis[2].url.split('://')[1])
  })
})
