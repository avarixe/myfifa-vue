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
      data: { booking: booking }
    })
  },
  remove ({ commit, rootState }, bookingId) {
    return apiRequest({
      method: 'delete',
      path: myfifa.bookings.record,
      pathData: { bookingId: bookingId },
      token: rootState.token
    })
  }
}
