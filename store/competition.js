import Vue from 'vue'
import http from '@/api'
import myfifa from '@/api/myfifa'
import objectify from '@/plugins/objectify'

// initial state
export const state = () => ({
  loaded: false,
  list: {}
})

// getters
export const getters = {
  array: state => Object.values(state.list),
  names: (state, getters) => [ ...new Set(getters.array.map(c => c.name)) ]
}

// actions
export const actions = {
  getAll ({ state, commit, rootState }, { teamId }) {
    if (!state.loaded) {
      return http({
        path: myfifa.competitions.index,
        pathData: { teamId },
        token: rootState.token,
        success: function ({ data }) {
          commit('SET_ALL', data)
        }
      })
    }
  },
  get ({ state, commit, rootState }, { competitionId }) {
    if (competitionId in state.list) {
      return { data: state.list[competitionId] }
    } else {
      return http({
        path: myfifa.competitions.record,
        pathData: { competitionId },
        token: rootState.token,
        success: function ({ data }) {
          commit('SET', data)
        }
      })
    }
  },
  create ({ commit, rootState }, { teamId, competition }) {
    return http({
      method: 'post',
      path: myfifa.competitions.index,
      pathData: { teamId },
      token: rootState.token,
      data: { competition }
    })
  },
  update ({ commit, rootState }, competition) {
    return http({
      method: 'patch',
      path: myfifa.competitions.record,
      pathData: { competitionId: competition.id },
      token: rootState.token,
      data: { competition }
    })
  },
  remove ({ commit, rootState }, competitionId) {
    return http({
      method: 'delete',
      path: myfifa.competitions.record,
      pathData: { competitionId },
      token: rootState.token
    })
  }
}

// mutations
export const mutations = {
  SET_ALL (state, competitions) {
    state.list = objectify(competitions)
    state.loaded = true
  },
  SET (state, competition) {
    Vue.set(state.list, competition.id, competition)
  },
  REMOVE (state, competitionId) {
    Vue.delete(state.list, competitionId)
  },
  RESET (state) {
    state.loaded = false
    state.list = {}
  }
}
