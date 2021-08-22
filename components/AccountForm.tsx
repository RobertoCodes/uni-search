import React, { useState } from 'react'
import Router from 'next/router'
import cookie from 'js-cookie'
import Link from 'next/link'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Alert from '@material-ui/lab/Alert'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import axios from 'axios'
import { useAppError } from './providers/ErrorProvider'
import { useAuth } from './providers/AuthProvider'

const useStyles = makeStyles((theme) => ({
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  form: {
    width: '50%',
    margin: '24px auto 0',
    padding: '24px',
  },
  errorMessage: {
    padding: '0px 8px',
  },
}))

export default function AccountForm({
  page,
}: {
  page: 'Signup' | 'Login'
}): React.ReactElement {
  const classes = useStyles()

  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { setAppError } = useAppError()
  const { setUser } = useAuth()

  const handleSubmit = async (e): Promise<void> => {
    e.preventDefault()
    try {
      const apiUrl = page === 'Signup' ? '/api/users' : 'api/auth'
      const response = await axios.post(apiUrl, { email, password })
      if (response.data) {
        // set cookie and user
        const { token, userId } = response.data
        cookie.set('token', token, { expires: 2 })
        setUser({ userId })
        Router.push('/')
      }
    } catch (err) {
      if (page === 'Signup' && err.response.status === 409) {
        setError('Email already in use')
      } else if (page === 'Login' && err.response.status === 401) {
        setError('Invalid email / password')
      } else {
        setAppError()
      }
    }
  }
  return (
    <>
      <Typography component="h1" variant="h5">
        {page === 'Signup' ? 'Sign Up' : 'Log In'}
      </Typography>
      <Paper elevation={3} variant="outlined" className={classes.form}>
        <form onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            onChange={(e) => setEmail(e.target.value)}
            id="email"
            type="email"
            label="Email Address"
            name="email"
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            id="password"
            autoComplete="current-password"
          />
          {error && (
            <Alert
              className={classes.errorMessage}
              variant="outlined"
              severity="error"
            >
              {error}
            </Alert>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            {page === 'Signup' ? 'Sign Up' : 'Log In'}
          </Button>
          <Grid container>
            <Grid item>
              {page === 'Signup' ? (
                <span>
                  Already have an account?{' '}
                  <Link href="/login">
                    <a>Sign In</a>
                  </Link>
                </span>
              ) : (
                <span>
                  Don&apos;t have an account?{' '}
                  <Link href="/signup">
                    <a>Sign Up</a>
                  </Link>
                </span>
              )}
            </Grid>
          </Grid>
        </form>
      </Paper>
    </>
  )
}
