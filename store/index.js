import VuexORM from '@vuex-orm/core'
import * as models from '@/models'
import { userFragment, teamFragment } from '@/fragments'
import pkg from '@/package.json'

// initial state
export const state = () => ({
  version: pkg.version,
  userId: null,
  targetRoute: null
})

// getters
export const getters = {
  currentUser: state => state.userId && models.User.find(state.userId)
}

// mutations
export const mutations = {
  setUserId (state, userId) {
    state.userId = userId
  },
  setTargetRoute (state, targetRoute) {
    state.targetRoute = targetRoute
  }
}

// actions
export const actions = {
  async nuxtClientInit ({ commit }, { route, $cookies, $graphql }) {
    const token = $cookies.get('token')

    if (token) {
      commit('auth/setToken', token)
      $graphql.default.setHeader('Authorization', `Bearer ${token}`)

      try {
        const query = `
          query fetchUser${route.query.teamId ? '($teamId: ID!)' : ''} {
            user { ...UserData }
            ${route.query.teamId ? 'team(id: $teamId) { ...TeamData }' : ''}
          }
          ${userFragment}
          ${route.query.teamId ? teamFragment : ''}
        `

        const { user, team } = await $graphql.default.request(
          query,
          { teamId: route.query.teamId },
          { Authorization: `Bearer ${token}` }
        )

        models.User.insert({ data: user })
        commit('setUserId', parseInt(user.id))
        team && models.Team.insert({ data: team })
      } catch (e) {
        console.error(e)
        commit('auth/setToken', null)
      }
    }
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
