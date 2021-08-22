import React from 'react'

import CssBaseline from '@material-ui/core/CssBaseline'
import Alert from '@material-ui/lab/Alert'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'
import Navbar from './NavBar'
import { useAppError } from './providers/ErrorProvider'

const useStyles = makeStyles({
  root: {
    display: 'grid',
    alignItems: 'center',
    width: '100%',
  },
  main: {
    margin: '24px auto 0',
    width: '80%',
    minHeight: 500,
    display: 'inline-block',
    padding: '12px',
    textAlign: 'center',
  },
})

export default function Layout({
  children,
}: {
  children: React.ReactNode
}): JSX.Element {
  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles)
    }
  }, [])

  const classes = useStyles()
  const { appError, removeAppError } = useAppError()
  return (
    <div className={classes.root}>
      <CssBaseline />
      <Navbar />
      {appError && (
        <Alert variant="filled" onClose={removeAppError} severity="error">
          {appError}
        </Alert>
      )}
      <Paper className={classes.main}>{children}</Paper>
    </div>
  )
}
