import React, { createProvider } from 'reactn'
//import numeric from '@mdb/common/numeric'

import { Base } from './components/reactn'

const INITIAL_STATE = {
  loading: true,
  users: 'dalborgo2',
  n: 5,
  obj: {
    mio: {
      k: 12
    }
  }
}
const Provider = createProvider(INITIAL_STATE)

Provider.addReducers({
  increment: (n, x = 1) => n+x
})

function App () {
  return <Provider>
    <Base/>
  </Provider>
}

export default App
