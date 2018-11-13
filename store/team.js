import Vue from 'vue'
import { format, parse, addYears } from 'date-fns'
import http from '@/api'
import myfifa from '@/api/myfifa'

// initial state
export const state = () => ({
  list: {},
  currentId: null
})

// getters
export const getters = {
  current: state => state.list[state.currentId],
  season: (state, getters) => {
    if (state.currentId !== null) {
      const date = parse(getters.current.start_date)
      const currentDate = parse(getters.current.current_date)
      return parseInt((currentDate - date) / (525600 * 60 * 1000))
    }
  },
  seasonStart: (state, getters) => {
    if (state.currentId !== null) {
      let date = parse(getters.current.start_date)
      const yearDiff = getters.season
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
  getAll ({ commit, rootState }) {
    return http({
      path: myfifa.teams.index,
      token: rootState.token,
      success: ({ data }) => {
        commit('SET_ALL', data)
      }
    })
  },
  get ({ commit, rootState }, { teamId, activate }) {
    return http({
      path: myfifa.teams.record,
      pathData: { teamId },
      token: rootState.token,
      success: ({ data }) => {
        if (activate) {
          commit('SET', data)
          commit('SELECT', data.id)
        }
      }
    })
  },
  analyzeSeason ({ rootState }, { teamId, season }) {
    return http({
      method: 'post',
      path: myfifa.analyze.season,
      pathData: { teamId, season },
      token: rootState.token
    })
  },
  create ({ commit, rootState }, team) {
    return http({
      method: 'post',
      path: myfifa.teams.index,
      token: rootState.token,
      data: { team },
      success: ({ data }) => {
        commit('SET', data)
      }
    })
  },
  update ({ commit, rootState }, team) {
    return http({
      method: 'patch',
      path: myfifa.teams.record,
      pathData: { teamId: team.id },
      token: rootState.token,
      data: { team },
      success: ({ data }) => {
        commit('SET', data)
        commit('SELECT', data.id)
      }
    })
  },
  remove ({ commit, rootState }, teamId) {
    return http({
      method: 'delete',
      path: myfifa.teams.record,
      pathData: { teamId },
      token: rootState.token,
      success: ({ data }) => {
        commit('REMOVE', data)
      }
    })
  }
}

// mutations
export const mutations = {
  SET_ALL (state, teams) {
    state.list = teams.reduce((list, team) => {
      list[team.id] = team
      return list
    }, {})
  },
  SET (state, team) {
    Vue.set(state.list, team.id, team)
  },
  REMOVE (state, team) {
    Vue.delete(state.list, team.id)
  },
  SELECT (state, teamId) {
    state.currentId = teamId
  },
  CLEAR (state) {
    state.currentId = null
  }
}
