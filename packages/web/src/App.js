import React from 'react'
import { add } from '@mdb/common'
import { Typography } from '@material-ui/core'

function App () {
  return <Typography>{add(2, 2)}</Typography>
}

export default App
