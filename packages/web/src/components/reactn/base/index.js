import React, { useGlobal, useDispatch } from 'reactn'
import { Typography, Button } from '@material-ui/core'

/*const mio = () => {
  return 13
}*/

//const incrementReducer = (n, action) => mio()
const increment2Reducer = (obj, action) => {
  obj.mio.k = 24
  return obj
}

const Base = () => {
  //const increment = useDispatch(incrementReducer, 'n')
  const dispatch = useDispatch()
  console.log('dispatch:', dispatch)
  const increment = useDispatch(dispatch.increment, 'n')
  const increment2 = useDispatch(increment2Reducer, 'obj')
  const [n] = useGlobal('n')
  const [obj] = useGlobal('obj')
  const [users] = useGlobal('users')
  return <>
    <Typography>{n}</Typography>
    <Typography>{users}</Typography>
    <Typography>{JSON.stringify(obj, null, 2)}</Typography>
    <Button onClick={() => increment()} href='#'>Cambia</Button>
    <Button onClick={() => increment2()} href='#'>Cambia 2</Button>
  </>
}

export default Base