import { gql } from 'nuxt-graphql-request'
import { parseISO } from 'date-fns'
import { teamFragment, userFragment } from '@/fragments'

export const state = () => ({
  token: null
})

export const mutations = {
  setToken (state, token) {
    state.token = token
  }
}

export const actions = {
  async createToken ({ commit }, { username, password }) {
    const query = gql`
      mutation grantAccessToken($username: String!, $password: String!) {
        grantAccessToken(username: $username, password: $password) {
          token
          expiresAt
          user { ...UserData }
          errors { fullMessages }
        }
      }
      ${userFragment}
    `

    const { grantAccessToken: { token, expiresAt, user, errors } } =
      await this.$graphql.default.request(query, { username, password })

    if (token) {
      commit('setToken', token)
      this.$graphql.default.setHeader('authorization', `Bearer ${token}`)
      this.$cookies.set('token', token, { expires: parseISO(expiresAt) })
      commit('setUserId', parseInt(user.id), { root: true })
      this.$db().model('User').insert({ data: user })
      commit('broadcaster/announce', {
        message: 'You have successfully logged in!',
        color: 'success'
      }, { root: true })

      if (this.$cookies.get('targetRoute')) {
        const targetRoute = this.$cookies.get('targetRoute')
        this.$cookies.remove('targetRoute')

        // load Team if required
        if (targetRoute.params.teamId) {
          const query = gql`
            fetchTeam($id: ID!) {
              team(id: $id) { ...TeamData }
            }
            ${teamFragment}
          `

          const { team } = await this.$graphql.default.request(
            query,
            { id: targetRoute.params.teamId }
          )

          this.$db().model('Team').insert({ data: team })
        }
        this.$router.push(targetRoute)
      } else {
        this.$router.push({ name: 'index' })
      }
    } else {
      throw new Error(errors.fullMessages[0])
    }
  },
  async revokeToken ({ state, commit, dispatch }) {
    const query = gql`
      mutation revokeAccessToken($token: String!) {
        revokeAccessToken(token: $token) {
          errors { fullMessages }
        }
      }
    `

    const { revokeAccessToken: { errors } } =
      await this.$graphql.default.request(query, { token: state.token })

    if (errors) {
      throw new Error(errors.fullMessages[0])
    } else {
      await dispatch('orm/deleteAll', null, { root: true })
      commit('setToken', null)
      this.$cookies.remove('token')
      this.$router.push({ name: 'login' })
      commit('broadcaster/announce', {
        message: 'You have successfully logged out!',
        color: 'danger'
      }, { root: true })
    }
  }
}
