import { attemptSignIn, signOut } from '../auth'
import { User } from '../models'
import { clearUser, notNull, updateFields } from '../functions/helpers'

export default {
  Query: {
    me: (root, args, {req}, info) => {
      const {userId} = req.session
      if (userId) {
        return User.byId(userId)
      } else {
        return {role: 'GUEST', username: ''}
      }
    },
    users: async (root, args, {req}, info) => {
      return User.search({}, notNull(args))
    },
    user: (root, {id}, {req}, info) => {
      return User.byId(id)
    }
  },
  Mutation: {
    del: async (root, args, {req}, info) => {
      const user = await User.byId(args.id)
      await user.del()
      return user
    },
    edit: async (root, {input}, {req}, info) => {
      const user = await User.byId(input.username)
      if (user.email !== input.email) {
        await User.check_email(input.email)
      }
      updateFields(input, user)
      await user.commit()
      return user
    },
    add: async (root, {input}, {req}, info) => {
      const {email, username, password} = input
      //await Joi.validate({email, username, password}, changeUser, {abortEarly: false})
      await User.check_email(email)
      await User.check_username(username)
      return User.createAndSave(clearUser(input))
    },
    newPass: async (root, args, {req}, info) => {
      const user = await User.byId(args.id)
      updateFields(args, user, ['id'])
      await user.commit()
      return user
    },
    signUp: async (root, args, {req}, info) => {
      //await Joi.validate(args, signUp, {abortEarly: false})
      await User.check_email(args.email)
      const user = await User.createAndSave(args)
      req.session.userId = user.id()
      return user
    },
    signIn: async (root, args, {req}, info) => {
      //console.dir(Joi.validate(args, signIn, {abortEarly: false}).error.details)
      //await Joi.validate(args, signIn, {abortEarly: true})
      const user = await attemptSignIn(args.username, args.password)
      req.session.userId = user.id()
      return user
    },
    signOut: (root, args, {req, res}, info) => {
      return signOut(req, res)
    }
  }
}
