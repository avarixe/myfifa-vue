import { gql } from 'nuxt-graphql-request'
import { userFragment } from '@/fragments'

// actions
export const actions = {
  async get ({ commit }) {
    const { user } = await this.$graphql.default.request(gql`
      query getUser {
        user { ...UserData }
      }
      ${userFragment}
    `)

    this.$db().model('User').insert({ data: user })
    commit('setUserId', parseInt(user.id), { root: true })
  },
  async create ({ commit }, attributes) {
    const query = gql`
      mutation createUser($attributes: UserRegistrationAttributes!) {
        registerUser(attributes: $attributes) {
          user { ...UserData }
        }
      }
      ${userFragment}
    `

    await this.$graphql.default.request(query, { attributes })

    commit('broadcaster/announce', {
      message: 'Account has been registered!',
      color: 'success'
    }, { root: true })
  },
  async changePassword (_, attributes) {
    const query = gql`
      mutation changePassword($attributes: UserPasswordChangeAttributes!) {
        changePassword(attributes: $attributes) {
          confirmation
        }
      }
    `

    await this.$graphql.default.request(query, { attributes })
  },
  async update (_, { id, attributes }) {
    const query = gql`
      mutation updateUser($id: ID!, $attributes: UserAttributes!) {
        updateUser(id: $id, attributes: $attributes) {
          user { ...UserData }
        }
      }
      ${userFragment}
    `

    const { updateUser: { user } } =
      await this.$graphql.default.request(query, { id, attributes })

    this.$db().model('User').update({ data: user })
  },
  async setDarkMode ({ dispatch }, { id, darkMode }) {
    await dispatch('update', { id, attributes: { darkMode } })
  }
}
