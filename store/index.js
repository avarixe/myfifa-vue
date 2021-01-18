import VuexORM from '@vuex-orm/core'
import Cookie from 'js-cookie'
import database from '@/database'
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
  SET_TOKEN (state, token) {
    state.token = token
  }
}

// actions
export const actions = {
  async nuxtServerInit ({ commit, dispatch }, { req, params }) {
    if (req.headers.cookie) {
      var { token, mode } = cookieparser.parse(req.headers.cookie)

      if (token) {
        commit('SET_TOKEN', token)

        try {
          await dispatch('user/GET')

          // load current Team, if present
          if ('teamId' in params) {
            await dispatch('teams/GET', { teamId: params.teamId })
          }
        } catch (e) {
          commit('SET_TOKEN', null)
        }
      }

      commit('app/SET_MODE', mode || 'light')
    }
  },
  async LOGIN ({ commit }, payload) {
    const data = await this.$axios.$post('oauth/token', {
      ...payload,
      client_id: this.$config.clientId,
      client_secret: this.$config.clientSecret
    })
    Cookie.set('token', data.access_token, {
      expires: data.expires_in / 86400
    })
    commit('SET_TOKEN', data.access_token)
    commit('broadcaster/ANNOUNCE', {
      message: 'You have successfully logged in!',
      color: 'success'
    }, { root: true })
  },
  async LOGOUT ({ commit }) {
    await this.$axios.$post('oauth/revoke', {
      client_id: this.$config.clientId,
      client_secret: this.$config.clientSecret
    })
    Cookie.remove('token')
    commit('SET_TOKEN', null)
    commit('broadcaster/ANNOUNCE', {
      message: 'You have successfully logged out!',
      color: 'danger'
    }, { root: true })
  }
}

// plugins
export const plugins = [
  VuexORM.install(database)
]
