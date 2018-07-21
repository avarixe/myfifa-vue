import apiRequest from '@/api'
import myfifa from '@/api/myfifa'

// actions
export const actions = {
  create ({ commit, rootState }, { matchId, booking }) {
    return apiRequest({
      method: 'post',
      path: myfifa.bookings.index,
      pathData: { matchId: matchId },
      token: rootState.token,
      data: { booking: booking },
      success: ({ data }) => {
        commit('match/set', data, { root: true })
      }
    })
  },
  remove ({ commit, rootState }, { bookingId }) {
    return apiRequest({
      method: 'patch',
      path: myfifa.bookings.record,
      pathData: { bookingId: bookingId },
      token: rootState.token,
      success: ({ data }) => {
        commit('match/set', data, { root: true })
      }
    })
  }
}
