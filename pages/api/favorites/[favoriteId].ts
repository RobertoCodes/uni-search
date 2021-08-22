import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDb } from '../../../db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method === 'DELETE') {
    try {
      const db = connectToDb()
      await db('favorites').where('id', req.query.favoriteId).del()
      res.status(200).send('')
    } catch (err) {
      res.status(500)
    }
  } else {
    res.status(404)
  }
  res.end()
}
