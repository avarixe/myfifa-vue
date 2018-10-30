import Vue from 'vue'
import apiRequest from '@/api'
import myfifa from '@/api/myfifa'

// actions
export const actions = {
  getAll ({ state, commit, rootState }, { competitionId }) {
    if (!state.loaded) {
      return apiRequest({
        path: myfifa.stages.index,
        pathData: { competitionId: competitionId },
        token: rootState.token,
        success: function ({ data }) {
          commit('competition/SET', {
            ...rootState.competition.list[competitionId],
            stages: data
          }, { root: true })
        }
      })
    }
  },
  create ({ commit, rootState }, { competitionId, stage }) {
    return apiRequest({
      method: 'post',
      path: myfifa.stages.index,
      pathData: { competitionId: competitionId },
      token: rootState.token,
      data: { stage: stage }
    })
  },
  update ({ commit, rootState }, payload) {
    return apiRequest({
      method: 'patch',
      path: myfifa.stages.record,
      pathData: { stageId: payload.id },
      token: rootState.token,
      data: { stage: payload }
    })
  },
  remove ({ commit, rootState }, payload) {
    return apiRequest({
      method: 'delete',
      path: myfifa.stages.record,
      pathData: { stageId: payload },
      token: rootState.token
    })
  }
}

// mutations
export const mutations = {
  SET_ALL (state, competitions) {
    state.list = competitions.reduce((list, competition) => {
      list[competition.id] = competition
      return list
    }, {})
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
