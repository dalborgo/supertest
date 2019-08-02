import express from 'express'
import session from 'express-session'
import { supertest_bucket, supertest_ottoman } from './db'
import { httpStatus, isProd } from './functions/helpers/couchbase'
import { ApolloServer } from 'apollo-server-express'
import typeDefs from './typeDefs'
import resolvers from './resolvers'
import schemaDirectives from './directives'
import { utilsRoutes } from './routes'
import config from 'config'

const bodyParser = require('body-parser')
const cors = require('cors')
const {MAXAGE_MINUTES, ORIGIN, PORT} = config.get('server')
const CouchbaseStore = require('connect-couchbase')(session)
const corsDef = {origin: ORIGIN, credentials: true}
supertest_bucket.on('connect', () => {
  const app = express()
  app.disable('x-powered-by')
  const couchbaseStore = new CouchbaseStore({
    db: supertest_bucket,
    prefix: 'sess::'
  })
  app.use(cors(corsDef))
  app.use(express.static('public'))
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({extended: true}))
  app.use(session({
    name: 'SUPERTEST_SESSION',
    store: couchbaseStore,
    secret: 'aplocandiemete',
    cookie: {
      maxAge: parseInt(MAXAGE_MINUTES) * 60 * 1000,
      sameSite: false,
      secure: false //true if https server
    },
    resave: true,
    rolling: true,
    saveUninitialized: false
  }))
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    schemaDirectives,
    introspection: true,
    playground: isProd() ? false : {
      settings: {
        'request.credentials': 'include'
      }
    },
    context: ({req, res}) => ({req, res})
  })
  //region ROUTES
  utilsRoutes(app, {supertest_bucket, supertest_ottoman})
  //endregion
  server.applyMiddleware({app, cors: corsDef})

  app.listen({port: PORT}, () => {
    console.log(`Server is running...`)
    console.log(`http://localhost:${PORT}${server.graphqlPath}`)
    httpStatus().then(r => {
      r.http_error ? console.error(JSON.stringify(r, null, 2)) : console.log(JSON.stringify(r, null, 2))
    })
  })
})
