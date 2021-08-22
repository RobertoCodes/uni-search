import axios from 'axios'
import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import {
  Backdrop,
  CircularProgress,
  Checkbox,
  Grid,
  IconButton,
  OutlinedInput,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
} from '@material-ui/core'
import { Favorite, FavoriteBorder, Search } from '@material-ui/icons'
import Alert from '@material-ui/lab/Alert'

import { useAppError } from './providers/ErrorProvider'
import { COUNTRIES } from '../constants'

const useStyles = makeStyles((theme) => ({
  inputContainer: {
    padding: '24px 24px',
  },
  tableContainer: {
    height: 500,
    position: 'relative',
    borderBottom: '1px solid #3f51b5',
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  tableRow: {
    backgroundColor: 'white',
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  emptyStateAlert: {
    textAlign: 'center',
    width: '88%',
    margin: 'auto',
  },
  headerColumn: {
    backgroundColor: '#3f51b5',
    color: theme.palette.common.white,
  },
  backdrop: {
    position: 'absolute',
    top: '37px',
    left: 0,
    width: '100%',
    height: 'calc(100% - 37px)',
    zIndex: 9999,
    color: '#fff',
  },
  input: {
    backgroundColor: '#fbfbfc',
  },
}))

const TABLE_COLUMNS = [
  {
    id: 'name',
    label: 'Name',
    width: '30%',
  },
  {
    id: 'country',
    label: 'Country',
    width: '30%',
  },
  {
    id: 'url',
    label: 'Website',
    width: '30%',
  },
  { id: 'favorite', label: '', width: '10%' },
]

type Uni = {
  id: string
  favoriteId?: string
  name: string
  country: string
}

export default function UniTable({
  isFavoritesTab = false,
  userId,
}: {
  isFavoritesTab: boolean
  userId: string
}): JSX.Element {
  const classes = useStyles()
  const { appError, setAppError } = useAppError()

  const [query, setQuery] = React.useState({ name: '', country: '' })
  const [searchInput, setSearchInput] = React.useState('')
  const [rowsPerPage, setRowsPerPage] = React.useState('25')
  const [currentPage, setCurrentPage] = React.useState(0)
  const [totalCount, setTotalCount] = React.useState(0)
  const [isFetching, setIsFetching] = React.useState(false)
  const [unis, setUnis] = React.useState([] as Uni[])

  React.useEffect(() => {
    const fetchUnis = async (): void => {
      const baseUrl = isFavoritesTab ? 'api/favorites' : 'api/unis'
      const { name, country } = query
      try {
        const { data } = await axios.get(
          // eslint-disable-next-line max-len
          `${baseUrl}?userId=${userId}&name=${name}&country=${country}&rowsPerPage=${rowsPerPage}&page=${currentPage}`
        )
        setTotalCount(data.totalCount)
        setUnis(data.unis)
        setIsFetching(false)
      } catch {
        setAppError(
          'There was an error loading universities. Please refresh the page.'
        )
        setIsFetching(false)
      }
    }
    setIsFetching(true)
    fetchUnis()
  }, [isFavoritesTab, userId, query, rowsPerPage, currentPage])

  const addFavorite = async (uniId: string): void => {
    try {
      const response = await axios.post(`api/favorites`, { userId, uniId })
      const updatedUnis = unis.map((uni: Uni) =>
        uni.id === uniId ? { ...uni, favoriteId: response.data.id } : uni
      )
      setUnis(updatedUnis)
    } catch {
      setAppError(
        'There was an error adding favorite. Please refresh the page.'
      )
    }
  }

  const removeFavorite = async ({
    uniId,
    favoriteId,
  }: {
    uniId: string
    favoriteId: string
  }): void => {
    try {
      await axios.delete(`api/favorites/${favoriteId}`)
      let updatedUnis
      if (isFavoritesTab) {
        // if favorites tab, remove the whole object from the data list
        updatedUnis = unis.filter((uni) => uni.favoriteId !== favoriteId)
        if (updatedUnis.length === 0) {
          // nothing left on this page, refetch previous page!
          if (currentPage > 0) {
            setCurrentPage(currentPage - 1)
          }
        } else {
          setTotalCount(totalCount - 1)
        }
      } else {
        updatedUnis = unis.map((uni) =>
          uni.id === uniId ? ({ ...uni, favoriteId: undefined } as Uni) : uni
        )
      }
      setUnis(updatedUnis)
    } catch {
      setAppError(
        'There was an error deleting favorite. Please refresh the page.'
      )
    }
  }
  const loggedIn = !!userId

  const TableUI = ({ data }: { data: Uni[] }): JSX.Element => {
    return (
      <>
        <TableContainer className={classes.tableContainer}>
          <Table size="small" stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {TABLE_COLUMNS.map((column) => (
                  <TableCell
                    className={classes.headerColumn}
                    width={column.width}
                    key={column.id}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((uni) => {
                return (
                  <TableRow className={classes.tableRow} key={uni.id}>
                    {TABLE_COLUMNS.map((column) => {
                      const value = uni[column.id]
                      return (
                        <TableCell key={column.id}>
                          {column.id === 'favorite' &&
                            (!loggedIn ? (
                              <Tooltip title="Must login to like universities">
                                <span>
                                  <Checkbox
                                    disabled={!loggedIn}
                                    icon={<FavoriteBorder />}
                                    checkedIcon={<Favorite />}
                                  />
                                </span>
                              </Tooltip>
                            ) : (
                              <Checkbox
                                onChange={(e, isChecked) => {
                                  if (isChecked) {
                                    addFavorite(uni.id)
                                  } else {
                                    removeFavorite({
                                      uniId: uni.id,
                                      favoriteId: uni.favoriteId!,
                                    })
                                  }
                                }}
                                icon={<FavoriteBorder />}
                                checkedIcon={<Favorite />}
                                checked={!!uni.favoriteId}
                              />
                            ))}
                          {column.id === 'url' ? (
                            <a className="url" href={value}>
                              {value.split('://')[1]}
                            </a>
                          ) : (
                            value
                          )}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
          <Backdrop className={classes.backdrop} open={isFetching}>
            <CircularProgress />
          </Backdrop>
        </TableContainer>
        {!!data.length && (
          <TablePagination
            component="div"
            count={totalCount}
            page={currentPage}
            onPageChange={(_, page) => setCurrentPage(page)}
            rowsPerPage={parseInt(rowsPerPage)}
            onRowsPerPageChange={(e) => setRowsPerPage(e.target.value)}
          />
        )}
      </>
    )
  }
  const shouldShowEmptyState = !appError && !isFetching && unis.length === 0

  return (
    <>
      <Grid container spacing={1} className={classes.inputContainer}>
        <Grid item xs={3}>
          <Select
            variant="outlined"
            value={query.country}
            displayEmpty
            onChange={(e) =>
              setQuery({
                name: query.name,
                country: e.target.value as string,
              })
            }
          >
            <MenuItem key="all" value="">
              All Countries
            </MenuItem>
            {COUNTRIES.map((countryName: string) => (
              <MenuItem key={countryName} value={countryName}>
                {countryName}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={8}>
          <OutlinedInput
            role="searchbox"
            fullWidth
            className={classes.input}
            type="text"
            value={searchInput}
            placeholder="Search for a university"
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(event) =>
              event.key === 'Enter' &&
              setQuery({ country: query.country, name: searchInput })
            }
          />
        </Grid>
        <Grid item xs={1}>
          <IconButton
            role="submitsearch"
            color="secondary"
            onClick={() =>
              setQuery({ country: query.country, name: searchInput })
            }
          >
            <Search />
          </IconButton>
        </Grid>
      </Grid>
      {shouldShowEmptyState ? (
        <>
          {isFavoritesTab && !(query.name || query.country) ? (
            <Alert
              icon={<FavoriteBorder />}
              className={classes.emptyStateAlert}
              severity="info"
            >
              You have no saved universities. Liked universities will appear
              here.
            </Alert>
          ) : (
            <Alert className={classes.emptyStateAlert} severity="info">
              We found no universities matching your search parameters.
            </Alert>
          )}
        </>
      ) : (
        <Paper>
          <TableUI data={unis} />
        </Paper>
      )}
    </>
  )
}
