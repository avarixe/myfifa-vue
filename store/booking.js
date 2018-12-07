import http from '@/api'
import myfifa from '@/api/myfifa'

// actions
export const actions = {
  create ({ commit, rootState }, { matchId, booking }) {
    return http({
      method: 'post',
      path: myfifa.bookings.index,
      pathData: { matchId },
      token: rootState.session.token,
      data: { booking }
    })
  },
  remove ({ commit, rootState }, bookingId) {
    return http({
      method: 'delete',
      path: myfifa.bookings.record,
      pathData: { bookingId },
      token: rootState.session.token
    })
  }
}
