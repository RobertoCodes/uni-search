import Knex from 'knex'
import knex from 'knex'

let cachedConnection: Knex

export const connectToDb = (): Knex => {
  if (cachedConnection) {
    return cachedConnection
  }
  const connection = knex({
    client: 'sqlite3',
    connection: () => ({
      filename: process.env.SQLITE_FILENAME as string,
    }),
    useNullAsDefault: true,
  })
  cachedConnection = connection
  return connection
}
