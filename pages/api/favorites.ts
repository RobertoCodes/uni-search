import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDb } from '../../db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method === 'GET') {
    const { name, country, rowsPerPage, page, userId } = req.query
    try {
      const db = connectToDb()
      const dataQuery = db
        .select(
          'unis.country',
          'unis.name',
          'unis.url',
          'unis.id',
          'favorites.id as favoriteId'
        )
        .from('unis')
        .join('favorites', 'favorites.uniId', 'unis.id')
        .where('favorites.userId', userId)
        .orderBy('unis.name', 'asc')
        .offset(parseInt(rowsPerPage) * parseInt(page))
        .limit(parseInt(rowsPerPage))
      const countQuery = db
        .count('* as count')
        .from('unis')
        .join('favorites', 'favorites.uniId', 'unis.id')
        .where('favorites.userId', userId)
        .first()
      if (country) {
        dataQuery.andWhere({ country })
        countQuery.andWhere({ country })
      }
      if (name) {
        dataQuery.andWhere('name', 'like', `%${name}%`)
        countQuery.andWhere('name', 'like', `%${name}%`)
      }
      const total = await countQuery
      const unis = await dataQuery

      res.status(200).json({
        totalCount: total.count,
        unis,
      })
    } catch (error) {
      res.status(500)
    }
  } else if (req.method === 'POST') {
    try {
      const db = connectToDb()
      const [id] = await db('favorites').insert({
        userId: req.body.userId,
        uniId: req.body.uniId,
      })
      res.status(200).json({ id })
    } catch (error) {
      res.status(500)
    }
  } else {
    res.status(404)
  }
  res.end()
}
