import { getNow } from '../index'
import axios from 'axios'
import config from 'config'

const {NODE_ENV, DB_SERVER, USER, PASS} = config.get('server')
const auth = {username: USER, password: PASS}
const {version} = require('../../../../package')

function gestConnErr (err) {
  switch (err.errno) {
    case 'ENETUNREACH':
      console.dir(err, {depth: 0})
      break
    default:
      console.warn(err)
  }

  if (err.code === 'ENOTFOUND') {
    console.warn('PROBLEMA DI COLLEGAMENTO AL SERVER [' + err.message + ']: RIAVVIO IL SERVER!')
    process.exit(1)
  }
}

function errorsLOG (err) {
  console.warn(getNow())
  try {
    if (err.response) {
      switch (err.response.status) {
        default:
          console.warn(err.message)
      }
    } else {
      gestConnErr(err)
    }
  } catch (err) {
    console.warn(err)
  }
}

async function getCouchInfo () {
  try {
    const r = await axios({url: `http://${DB_SERVER}:8091/pools/default`, auth})
    const {version, os, status} = r.data['nodes'][0]
    return {version, os, status, db_server: DB_SERVER}
  } catch (err) {
    errorsLOG(err)
    return err
  }
}

export async function getView (view, stale = false) {
  try {
    const r = await axios({
      url: `http://${DB_SERVER}:8092/${USER}/_design/${USER}/_view/${view}?stale=${stale}`,
      auth
    })
    return r.data
  } catch (err) {
    errorsLOG(err)
    return err
  }
}

async function getIndexStatus () {
  try {
    const r = await axios({url: `http://${DB_SERVER}:8091/indexStatus`, auth})
    let problem = false, output = []
    r.data['indexes'].forEach(e => {
      problem |= e.status !== 'Ready'
      if ([USER].includes(e.bucket)) {
        output.push({name: e.index, status: e.status, bucket: e.bucket})
      }
    })
    problem && console.warn('ATTENZIONE INDICI NON CARICATI!')
    return output
  } catch (err) {
    errorsLOG(err)
    return err
  }
}

function httpError (err) {
  console.warn(getNow())
  return {
    http_error: err.statusText,
    code: err.status
  }
}

export function isProd () {
  return NODE_ENV === 'production'
}

export async function httpStatus () {
  try {
    let ob1 = getCouchInfo()
    let ob2 = getIndexStatus()
    let server = await ob1
    let indexes = await ob2
    if (server instanceof Error)
      return httpError(server.response)
    if (indexes instanceof Error)
      return httpError(indexes.response)
    return {version, nodejs: process.version, bucket: USER, node_env: NODE_ENV, server, indexes}
  } catch (err) {
    return err
  }
}
