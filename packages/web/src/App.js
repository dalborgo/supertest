import React from 'react'
import numeric from '@mdb/common/numeric'
import { Typography } from '@material-ui/core'

function App () {
  return <Typography>{numeric.printMoney(4)}</Typography>
}

export default App
