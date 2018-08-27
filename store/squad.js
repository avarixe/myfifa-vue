import Vue from 'vue'
import apiRequest from '@/api'
import myfifa from '@/api/myfifa'

// initial state
export const state = () => ({
  list: {}
})

// actions
export const actions = {
  getAll ({ state, commit, rootState }, { teamId }) {
    return apiRequest({
      path: myfifa.squads.index,
      pathData: { teamId: teamId },
      token: rootState.token,
      success: function ({ data }) {
        commit('SET_ALL', data)
      }
    })
  },
  get ({ rootState }, { squadId }) {
    return apiRequest({
      path: myfifa.squads.record,
      pathData: { squadId: squadId },
      token: rootState.token
    })
  },
  create ({ commit, rootState }, { teamId, squad }) {
    return apiRequest({
      method: 'post',
      path: myfifa.squads.index,
      pathData: { teamId: teamId },
      token: rootState.token,
      data: { squad: squad },
      success: ({ data }) => {
        commit('SET', data)
      }
    })
  },
  update ({ commit, rootState }, payload) {
    return apiRequest({
      method: 'patch',
      path: myfifa.squads.record,
      pathData: { squadId: payload.id },
      token: rootState.token,
      data: { squad: payload },
      success: ({ data }) => {
        commit('SET', data)
      }
    })
  },
  remove ({ commit, rootState }, payload) {
    return apiRequest({
      method: 'delete',
      path: myfifa.squads.record,
      pathData: { squadId: payload },
      token: rootState.token,
      success: ({ data }) => {
        commit('REMOVE', data.id)
      }
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
  },
  SET (state, squad) {
    Vue.set(state.list, squad.id, squad)
  },
  REMOVE (state, squadId) {
    Vue.delete(state.list, squadId)
  }
}
