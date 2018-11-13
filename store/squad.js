import Vue from 'vue'
import http from '@/api'
import myfifa from '@/api/myfifa'
import objectify from '@/plugins/objectify'

// initial state
export const state = () => ({
  loaded: false,
  list: {}
})

// actions
export const actions = {
  getAll ({ state, commit, rootState }, { teamId }) {
    if (!state.loaded) {
      return http({
        path: myfifa.squads.index,
        pathData: { teamId },
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
      return http({
        path: myfifa.squads.record,
        pathData: { squadId },
        token: rootState.token,
        success: function ({ data }) {
          commit('SET', data)
        }
      })
    }
  },
  create ({ commit, rootState }, { teamId, squad }) {
    return http({
      method: 'post',
      path: myfifa.squads.index,
      pathData: { teamId },
      token: rootState.token,
      data: { squad }
    })
  },
  update ({ commit, rootState }, squad) {
    return http({
      method: 'patch',
      path: myfifa.squads.record,
      pathData: { squadId: squad.id },
      token: rootState.token,
      data: { squad }
    })
  },
  remove ({ commit, rootState }, squadId) {
    return http({
      method: 'delete',
      path: myfifa.squads.record,
      pathData: { squadId },
      token: rootState.token
    })
  }
}

// mutations
export const mutations = {
  SET_ALL (state, squads) {
    state.list = objectify(squads)
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
