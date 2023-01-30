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
          errors { fullMessages }
        }
      }
    `

    const { registerUser: { errors } } =
      await this.$graphql.default.request(query, { attributes })

    if (errors) {
      throw new Error(errors.fullMessages[0])
    } else {
      commit('broadcaster/announce', {
        message: 'Account has been registered!',
        color: 'success'
      }, { root: true })
    }
  },
  async changePassword (_, attributes) {
    const query = gql`
      mutation changePassword($attributes: UserPasswordChangeAttributes!) {
        changePassword(attributes: $attributes) {
          errors { fullMessages }
        }
      }
    `

    const { changePassword: { errors } } =
      await this.$graphql.default.request(query, { attributes })

    if (errors) {
      throw new Error(errors.fullMessages[0])
    }
  },
  async update (_, { id, attributes }) {
    const query = gql`
      mutation updateUser($id: ID!, $attributes: UserAttributes!) {
        updateUser(id: $id, attributes: $attributes) {
          user { ...UserData }
          errors { fullMessages }
        }
      }
      ${userFragment}
    `

    const { updateUser: { user, errors } } =
      await this.$graphql.default.request(query, { id, attributes })

    if (user) {
      this.$db().model('User').update({ data: user })
    } else {
      throw new Error(errors.fullMessages[0])
    }
  },
  async setDarkMode ({ dispatch }, { id, darkMode }) {
    await dispatch('update', { id, attributes: { darkMode } })
  }
}
