import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDb } from '../../db'

type ResponseData = {
  totalCount: number
  unis: {
    id: string
    country: string
    name: string
    url: string
    favoriteId?: string
  }[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
): Promise<void> {
  if (req.method === 'GET') {
    try {
      const db = connectToDb()
      const { name, country, rowsPerPage, page, userId } = req.query
      const dataQuery = db
        .select('*')
        .from('unis')
        .orderBy('unis.name', 'asc')
        .offset(parseInt(rowsPerPage) * parseInt(page))
        .limit(parseInt(rowsPerPage))
      const countQuery = db.count('* as count').from('unis').first()

      if (country) {
        dataQuery.where({ country })
        countQuery.where({ country })
        if (name) {
          dataQuery.andWhere('name', 'like', `%${name}%`)
          countQuery.andWhere('name', 'like', `%${name}%`)
        }
      } else if (name) {
        dataQuery.where('name', 'like', `%${name}%`)
        countQuery.where('name', 'like', `%${name}%`)
      }
      const total = await countQuery
      let unis = await dataQuery
      if (userId) {
        const favorites = await db
          .from('favorites')
          .whereIn(
            'uniId',
            unis.map((uni) => uni.id)
          )
          .andWhere('userId', userId)
          .select('id', 'uniId')
        unis = unis.map((uni) => ({
          ...uni,
          favoriteId: favorites.find((favorite) => favorite.uniId === uni.id)
            ?.id,
        }))
      }
      res.status(200).json({
        totalCount: total.count,
        unis,
      })
    } catch {
      res.status(500)
    }
  } else {
    res.status(404)
  }
  res.end()
}
