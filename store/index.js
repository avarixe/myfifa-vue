import VuexORM from '@vuex-orm/core'
import Cookie from 'js-cookie'
import * as models from '@/models'
import cookieparser from 'cookieparser'
import pkg from '@/package.json'

// initial state
export const state = () => ({
  version: pkg.version,
  token: null
})

// getters
export const getters = {
  authenticated: state => state.token !== null
}

// mutations
export const mutations = {
  setToken (state, token) {
    state.token = token
  }
}

// actions
export const actions = {
  async nuxtServerInit ({ commit, dispatch }, { req, params }) {
    if (req.headers.cookie) {
      var { token, mode } = cookieparser.parse(req.headers.cookie)

      if (token) {
        commit('setToken', token)

        try {
          await dispatch('user/get')

          // load current Team, if present
          if ('teamId' in params) {
            await dispatch('teams/get', { teamId: params.teamId })
          }
        } catch (e) {
          commit('setToken', null)
        }
      }

      commit('app/setMode', mode || 'light')
    }
  },
  async login ({ commit }, payload) {
    const data = await this.$axios.$post('oauth/token', {
      ...payload,
      client_id: this.$config.clientId,
      client_secret: this.$config.clientSecret
    })
    Cookie.set('token', data.access_token, {
      expires: data.expires_in / 86400
    })
    commit('setToken', data.access_token)
    commit('broadcaster/announce', {
      message: 'You have successfully logged in!',
      color: 'success'
    }, { root: true })
  },
  async logout ({ commit }) {
    await this.$axios.$post('oauth/revoke', {
      client_id: this.$config.clientId,
      client_secret: this.$config.clientSecret
    })
    Cookie.remove('token')
    commit('setToken', null)
    commit('broadcaster/announce', {
      message: 'You have successfully logged out!',
      color: 'danger'
    }, { root: true })
  }
}

// setup VuexORM database
const database = new VuexORM.Database()
for (const key in models) {
  database.register(models[key])
}

// plugins
export const plugins = [
  VuexORM.install(database, { namespace: 'orm' })
]
