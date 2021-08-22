import type { NextApiRequest, NextApiResponse } from 'next'
import assert from 'assert'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { connectToDb } from '../../db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method === 'POST') {
    try {
      assert.notEqual(null, req.body.email, 'Email required')
      assert.notEqual(null, req.body.password, 'Password required')
    } catch (bodyError) {
      res.status(403).send(bodyError.message)
    }
    const db = connectToDb()
    const { email } = req.body
    const { password } = req.body
    try {
      const user = await db('users').select('*').where({ email }).first()
      if (!user) {
        res.status(401).json({ error: true, message: 'Auth Failed' })
      } else {
        const match = await bcrypt.compare(password, user.password)
        if (match) {
          const token = jwt.sign(
            { userId: user.userId, email: user.email },
            process.env.JWT_SECRET,
            {
              expiresIn: process.env.TOKENT_EXPIRATION_TIME,
            }
          )
          res.status(200).json({ token })
        } else {
          res.status(401).json({ error: true, message: 'Auth Failed' })
        }
      }
    } catch {
      res.status(500)
    }
  } else {
    res.status(404)
  }
  res.end()
}
