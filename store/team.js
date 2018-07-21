import Vue from 'vue'
import { format, parse, addYears } from 'date-fns'
import apiRequest from '@/api'
import myfifa from '@/api/myfifa'

// initial state
export const state = () => ({
  list: {},
  currentId: null
})

// getters
export const getters = {
  current: state => state.list[state.currentId],
  seasonStart: (state, getters) => {
    if (state.currentId !== null) {
      let date = parse(getters.current.start_date)
      let currentDate = parse(getters.current.current_date)
      let yearDiff = parseInt((currentDate - date) / (525600 * 60 * 1000))
      date = addYears(date, yearDiff)
      return format(date, 'YYYY-MM-DD')
    }
  },
  seasonEnd: (state, getters) => {
    if (getters.seasonStart) {
      let date = parse(getters.seasonStart)
      date = addYears(date, 1)
      return format(date, 'YYYY-MM-DD')
    }
  }

}

// actions
export const actions = {
  refresh ({ state, commit, rootState }) {
    return apiRequest({
      path: myfifa.teams.all,
      token: rootState.token,
      success: ({ data }) => {
        commit('refresh', data)
      }
    })
  },
  get ({ commit, rootState }, { teamId, activate }) {
    return apiRequest({
      path: myfifa.teams.get,
      pathData: { teamId: teamId },
      token: rootState.token,
      success: ({ data }) => {
        if (activate) {
          commit('set', data)
          commit('select', data.id)
        }
      }
    })
  },
  create ({ commit, rootState }, payload) {
    return apiRequest({
      method: 'post',
      path: myfifa.teams.all,
      token: rootState.token,
      data: { team: payload },
      success: ({ data }) => {
        commit('set', data)
      }
    })
  },
  update ({ commit, rootState }, payload) {
    return apiRequest({
      method: 'patch',
      path: myfifa.teams.get,
      pathData: { teamId: payload.id },
      token: rootState.token,
      data: { team: payload },
      success: ({ data }) => {
        commit('set', data)
        commit('select', data.id)
      }
    })
  },
  remove ({ commit, rootState }, payload) {
    return apiRequest({
      method: 'delete',
      path: myfifa.teams.get,
      pathData: { teamId: payload },
      token: rootState.token,
      success: ({ data }) => {
        commit('remove', data)
      }
    })
  }
}

// mutations
export const mutations = {
  refresh (state, teams) {
    state.list = teams.reduce((list, team) => {
      list[team.id] = team
      return list
    }, {})
  },
  set (state, team) {
    Vue.set(state.list, team.id, team)
  },
  remove (state, team) {
    delete state.list[team.id]
  },
  select (state, teamId) {
    state.currentId = teamId
  },
  clear (state) {
    state.currentId = null
  }
}
