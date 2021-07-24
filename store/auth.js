import { gql } from 'nuxt-graphql-request'
import { addSeconds } from 'date-fns'
import { teamFragment } from '@/fragments'

export const state = () => ({
  token: null
})

export const mutations = {
  setToken (state, token) {
    state.token = token
  }
}

export const actions = {
  async createToken ({ commit, dispatch }, payload) {
    const data = await this.$axios.$post('oauth/token', {
      ...payload,
      client_id: this.$config.clientId,
      client_secret: this.$config.clientSecret
    })
    commit('setToken', data.access_token)
    this.$graphql.default.setHeader(
      'authorization',
      `Bearer ${data.access_token}`
    )
    this.$cookies.set('token', data.access_token, {
      expires: addSeconds(new Date(), data.expires_in || 0)
    })
    commit('setUserId', data.user.id, { root: true })
    this.$db().model('User').insert({
      data: {
        ...data.user,
        fullName: data.user.full_name,
        darkMode: data.user.dark_mode
      }
    })
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
  },
  async revokeToken ({ commit, dispatch }) {
    await this.$axios.$post('oauth/revoke', {
      client_id: this.$config.clientId,
      client_secret: this.$config.clientSecret
    })
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
