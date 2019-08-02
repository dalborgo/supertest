import isNil from 'lodash/isNil'
import pickBy from 'lodash/pickBy'
import moment from 'moment'

export function notNull (args, def) {
  const newObj = {...def, ...args}
  return pickBy(newObj, v => !isNil(v))
}

export const getNow = () => moment().format('YYYYMMDDHHmmss')
export const clearUser = input => {
  return input
}

export function updateFields (input, obj, skipObj = []) {
  for (let o in input) {
    if (skipObj.indexOf(o) === -1) {
      obj[o] = input[o]
    }
  }
}
