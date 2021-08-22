import type { NextApiRequest, NextApiResponse } from 'next'

import jwt from 'jsonwebtoken'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method === 'GET') {
    if (!('token' in req.cookies)) {
      res.status(401).json({ message: 'Unable to auth' })
      return
    }
    let decoded
    const { token } = req.cookies
    if (token) {
      decoded = jwt.verify(token, process.env.JWT_SECRET)

      if (decoded) {
        res.json(decoded)
      } else {
        res.status(401).json({ message: 'Unable to auth' })
      }
    }
  } else {
    res.status(404)
  }
  res.end()
}
