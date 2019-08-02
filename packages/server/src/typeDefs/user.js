import { gql } from 'apollo-server-express'

export default gql`
    extend type Query {
        me: User
        user(id: ID!): User @guest
        users(limit: Int, skip: Int): [User!]! @guest
    }

    extend type Mutation {
        add(input: AddUserInput!): User @guest
        edit(input: EditUserInput!): User @guest
        del(id: ID!): User @guest
        newPass(id: ID!, password: String!): User @guest
        signUp(email: String!, username: String!, name: String, role: Roles!, password: String!): User @guest
        signIn(username: String!, password: String!): User @guest
        signOut: Boolean @guest
    }

    input AddUserInput {
        email: String!
        username: String!
        name: String
        role: Roles!
        password: String!
    }

    input EditUserInput {
        username: String!
        email: String!,
        role: Roles!
    }
    
    enum Roles {
        QUBO
        GUEST
    }

    type User {
        id: ID!
        email: String!
        username: String!
        name: String
        role: Roles!
        createdAt: String!
        updatedAt: String!
    }
`
