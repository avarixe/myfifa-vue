import http from '@/api'
import myfifa from '@/api/myfifa'
import { Booking } from '@/models'

// actions
export const actions = {
  FETCH ({ rootState }, { matchId }) {
    return http({
      method: 'get',
      path: myfifa.bookings.index,
      pathData: { matchId },
      token: rootState.token,
      success: function ({ data }) { Booking.insert({ data }) }
    })
  },
  CREATE ({ rootState }, { matchId, booking }) {
    return http({
      method: 'post',
      path: myfifa.bookings.index,
      pathData: { matchId },
      token: rootState.token,
      data: { booking }
    })
  },
  REMOVE ({ rootState }, bookingId) {
    return http({
      method: 'delete',
      path: myfifa.bookings.record,
      pathData: { bookingId },
      token: rootState.token
    })
  }
}
