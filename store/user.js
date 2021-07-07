import { gql } from 'nuxt-graphql-request'

// actions
export const actions = {
  async get ({ commit }) {
    const query = gql`
      query fetchUser {
        user {
          id
          fullName
          username
          email
          darkMode
        }
      }
    `

    const { user } = await this.$graphql.default.request(query)
    this.$db().model('User').insert({ data: user })
    commit('setUserId', user.id, { root: true })
  },
  async create ({ commit }, user) {
    await this.$axios.$post('users.json', { user })
    commit('broadcaster/announce', {
      message: 'Account has been registered!',
      color: 'success'
    }, { root: true })
  },
  async changePassword (_, user) {
    await this.$axios.$patch('users.json', { user })
  },
  async update ({ rootState }, attributes) {
    const query = gql`
      mutation updateUser($id: ID!, $attributes: UserAttributes!) {
        updateUser(id: $id, attributes: $attributes) {
          user {
            id
            fullName
            email
            username
          }
          errors {
            fullMessages
          }
        }
      }
    `

    const { updateUser: { errors, user } } = await this.$graphql.default.request(query, {
      id: rootState.userId,
      attributes
    })
    if (user) {
      this.$db().model('User').update({ data: user })
    } else {
      throw new Error(errors.fullMessages[0])
    }
  },
  async setDarkMode ({ rootState }, darkModeOn) {
    const query = gql`
      mutation setDarkMode($userId: ID!, $darkModeOn: Boolean!) {
        updateUser(id: $userId, attributes: { darkMode: $darkModeOn }) {
          user {
            id
            darkMode
          }
        }
      }
    `

    const { updateUser: { user } } = await this.$graphql.default.request(query, {
      userId: rootState.userId,
      darkModeOn
    })
    this.$db().model('User').update({ data: user })
  }
}
