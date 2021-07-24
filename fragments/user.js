import { gql } from 'nuxt-graphql-request'

export const userFragment = gql`
  fragment UserData on User {
    id
    email
    username
    fullName
    darkMode
  }
`
