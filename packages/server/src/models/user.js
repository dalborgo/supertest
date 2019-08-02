import { hashSync, compare } from 'bcryptjs'
import {
  supertest_ottoman
} from '../db'
import { getFunctions } from './helpers'

const _throw = (m, c) => {
  const error = new Error(m)
  error.code = c
  throw error
}
const User = getFunctions.call(supertest_ottoman.model('USER', {
  username: {type: 'string', readonly: true},
  email: 'string',
  name: 'string',
  role: 'string',
  password: 'string',
  createdAt: {type: 'Date', default: Date.now},
  updatedAt: 'Date'
}, {
  id: 'username'
}))

User.pre('save', function (user, next) {
  //fixme capire come non ricriptare la password
  if (this.password && this.password.length !== 60) {
    this.password = hashSync(this.password, 10)
  }
  this.updatedAt = new Date()
  next()
})

User.check_email = async email => await User.how_many({email}) && _throw(`Duplicated: ${email}`, 'DUPMAIL') //non ritorno niente ma serve l'await per testare il throw
User.check_username = async username => await User.how_many({username}) && _throw(`Duplicated: ${username}`, 'DUPUSERNAME')

User.prototype.matchesPassword = function (password) {
  return compare(password, this.password)
}

export default User

