import { format, parse, addYears } from 'date-fns'
import http from '@/api'
import myfifa from '@/api/myfifa'
import Team from '@/models/Team'

// initial state
const state = () => ({
  currentId: null
})

// getters
const getters = {
  current: state => Team.find(state.currentId),
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
      date = addYears(date, getters.season)
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

// mutations
const mutations = {
  SELECT (state, teamId) {
    state.currentId = teamId
  },
  CLEAR (state) {
    state.currentId = null
  }
}

// actions
const actions = {
  FETCH ({ commit, rootState }) {
    return http({
      path: myfifa.teams.index,
      token: rootState.session.token,
      success: ({ data }) => {
        Team.insert({ data })
      }
    })
  },
  GET ({ commit, rootState }, { teamId, activate }) {
    return http({
      path: myfifa.teams.record,
      pathData: { teamId },
      token: rootState.session.token,
      success: ({ data }) => {
        if (activate) {
          Team.insert({ data })
          commit('SELECT', data.id)
        }
      }
    })
  },
  ANALYZE_SEASON ({ rootState }, { teamId, season }) {
    return http({
      method: 'post',
      path: myfifa.analyze.season,
      pathData: { teamId, season },
      token: rootState.session.token
    })
  },
  CREATE ({ commit, rootState }, team) {
    return http({
      method: 'post',
      path: myfifa.teams.index,
      token: rootState.session.token,
      data: { team },
      success: ({ data }) => {
        Team.insert({ data })
      }
    })
  },
  UPDATE ({ commit, rootState }, team) {
    return http({
      method: 'patch',
      path: myfifa.teams.record,
      pathData: { teamId: team.id },
      token: rootState.session.token,
      data: { team },
      success: ({ data }) => {
        Team.insert({ data })
      }
    })
  },
  REMOVE ({ commit, rootState }, teamId) {
    return http({
      method: 'delete',
      path: myfifa.teams.record,
      pathData: { teamId },
      token: rootState.session.token,
      success: ({ data }) => {
        Team.delete(data.id)
      }
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
