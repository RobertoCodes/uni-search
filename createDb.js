const knex = require('knex')
const axios = require('axios')

// creates database scheme and populates 'unis' table with the
// api response from http://universities.hipolabs.com/search
async function createDb() {
  const db = knex({
    client: 'sqlite3',
    connection: () => ({
      filename: './uni.db',
    }),
    useNullAsDefault: true
  })
  const createUniTableCall = db.schema.createTable('unis', (table) => {
    table.increments('id')
    table.string('name')
    table.string('country')
    table.string('url')
  })

  const createUserTableCall = db.schema.createTable('users', (table) => {
    table.increments('id')
    table.string('userId')
    table.string('email')
    table.string('password')
  })

  const createFavoriteTableCall = db.schema.createTable(
    'favorites',
    (table) => {
      table.increments('id')
      table.integer('uniId').references('id').inTable('unis')
      table.string('userId').references('userId').inTable('users')
    }
  )

  const response = await axios.get('http://universities.hipolabs.com/search')

  const unis = response.data.map((row) => ({
    country: row.country,
    name: row.name,
    url: row.web_pages[0], // assume we want the first webpage for now
  }))
  const dbCalls = [
    createUniTableCall,
    createUserTableCall,
    createFavoriteTableCall,
  ]
  // https://stackoverflow.com/questions/25257754/sqlitetoo-many-terms-in-compound-select
  let i
  let j
  let temporary
  const chunk = 450
  for (i = 0, j = unis.length; i < j; i += chunk) {
    temporary = unis.slice(i, i + chunk)
    dbCalls.push(db('unis').insert(temporary))
  }
  try {
    // make db calls sequentially
    for (let idx = 0; idx < dbCalls.length; idx += 1) {
      await dbCalls[idx]
    }
    console.log('db tables created and unis populated')
    process.exit()
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}
createDb()
