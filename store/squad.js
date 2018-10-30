import Vue from 'vue'
import $_http from '@/api'
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
      return $_http({
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
      return $_http({
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
    return $_http({
      method: 'post',
      path: myfifa.squads.index,
      pathData: { teamId: teamId },
      token: rootState.token,
      data: { squad: squad }
    })
  },
  update ({ commit, rootState }, payload) {
    return $_http({
      method: 'patch',
      path: myfifa.squads.record,
      pathData: { squadId: payload.id },
      token: rootState.token,
      data: { squad: payload }
    })
  },
  remove ({ commit, rootState }, payload) {
    return $_http({
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
