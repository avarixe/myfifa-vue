import Vue from 'vue'
import apiRequest from '@/api'
import myfifa from '@/api/myfifa'

// initial state
export const state = () => ({
  loaded: false,
  list: {}
})

// actions
export const actions = {
  getAll ({ state, commit, rootState }, { teamId }) {
    if (!state.loaded) {
      return apiRequest({
        path: myfifa.squads.index,
        pathData: { teamId: teamId },
        token: rootState.token,
        success: function ({ data }) {
          commit('SET_ALL', data)
        }
      })
    }
  },
  get ({ state, commit, rootState }, { squadId }) {
    if (squadId in state.list) {
      return { data: state.list[squadId] }
    } else {
      return apiRequest({
        path: myfifa.squads.record,
        pathData: { squadId: squadId },
        token: rootState.token,
        success: function ({ data }) {
          commit('SET', data)
        }
      })
    }
  },
  create ({ commit, rootState }, { teamId, squad }) {
    return apiRequest({
      method: 'post',
      path: myfifa.squads.index,
      pathData: { teamId: teamId },
      token: rootState.token,
      data: { squad: squad }
    })
  },
  update ({ commit, rootState }, payload) {
    return apiRequest({
      method: 'patch',
      path: myfifa.squads.record,
      pathData: { squadId: payload.id },
      token: rootState.token,
      data: { squad: payload }
    })
  },
  remove ({ commit, rootState }, payload) {
    return apiRequest({
      method: 'delete',
      path: myfifa.squads.record,
      pathData: { squadId: payload },
      token: rootState.token
    })
  }
}

// mutations
export const mutations = {
  SET_ALL (state, squads) {
    state.list = squads.reduce((list, squad) => {
      list[squad.id] = squad
      return list
    }, {})
    state.loaded = true
  },
  SET (state, squad) {
    Vue.set(state.list, squad.id, squad)
  },
  REMOVE (state, squadId) {
    Vue.delete(state.list, squadId)
  },
  RESET (state) {
    state.loaded = false
    state.list = {}
  }
}
