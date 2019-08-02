import config from 'config'

const {DB_SERVER, USER, PASS} = config.get('server')

const couchbase = require('couchbase')

const ottoman = require('ottoman')
const supertest_ottoman = new ottoman.Ottoman()

const cluster = new couchbase.Cluster(`couchbase://${DB_SERVER}`)

const supertest_bucket = cluster.openBucket('cynation', GDPR_PASS)

supertest_ottoman.store = new ottoman.CbStoreAdapter(supertest_bucket, couchbase)

export {
  supertest_bucket,
  supertest_ottoman
}
