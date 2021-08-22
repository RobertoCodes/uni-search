import { v4 } from 'uuid'
import assert from 'assert'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDb } from '../../db'

const SALT_ROUNDS = 10

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method === 'POST') {
    // signup
    try {
      assert.notEqual(null, req.body.email, 'Email required')
      assert.notEqual(null, req.body.password, 'Password required')
    } catch (bodyError) {
      res.status(403).json({ error: true, message: bodyError.message })
    }
    const db = connectToDb()

    const { email } = req.body
    const { password } = req.body
    try {
      const users = await db('users').select('*').where({ email })
      if (users.length < 1) {
        const hash = await bcrypt.hash(password, SALT_ROUNDS)
        const userId = v4()
        await db('users').insert({
          userId,
          email,
          password: hash,
        })
        const token = jwt.sign({ userId, email }, process.env.JWT_SECRET, {
          expiresIn: process.env.TOKENT_EXPIRATION_TIME,
        })
        res.status(200).json({ token, userId })
      } else {
        // User exists
        res.status(409)
      }
    } catch (err) {
      res.status(500).json({ error: true, message: 'Error finding User' })
    }
    res.end()
  } else {
    res.status(404)
  }
}
