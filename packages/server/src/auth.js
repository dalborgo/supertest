import { AuthenticationError, ApolloError } from 'apollo-server-express'
import { User } from './models'
import util from 'util'

const find = util.promisify(User.find.bind(User))
export const attemptSignIn = async (username, password) => {
  const message = 'Incorrect username or password. Please try again.'
  const user = (await find({username}))[0] //only unique email allowed
  if (!user || !await user.matchesPassword(password)) {
    throw new AuthenticationError(message)
  }
  return user
}

const signedIn = req => req.session.userId

export const ensureSignedIn = req => {
  if (!signedIn(req)) {
    throw new ApolloError('You must be signed in.', 'NOTSIGNINERROR');
  }
}

export const ensureSignedOut = req => {
  if (signedIn(req)) {
    throw new AuthenticationError('You are already signed in.')
  }
}

export const signOut = (req, res) => new Promise(
  (resolve, reject) => {
    req.session.destroy(err => {
      if (err) reject(err)

      res.clearCookie('SUPERTEST_SESSION')

      resolve(true)
    })
  }
)