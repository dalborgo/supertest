import React, { createProvider } from 'reactn'
//import numeric from '@mdb/common/numeric'

import { Prova } from './components'

const INITIAL_STATE = {
  loading: true,
  users: 'dalborgo2',
  n:0,
  obj:{
    mio:{
      k:12
    }
  }
}

const Provider = createProvider(INITIAL_STATE)

function App () {
  return <Provider>
    <Prova/>
  </Provider>
}

export default App
