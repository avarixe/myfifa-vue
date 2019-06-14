import http from '@/api'
import myfifa from '@/api/myfifa'
import { crud } from '@/api/actions'
import { Booking } from '@/models'

// actions
export const actions = {
  ...crud({
    model: Booking,
    route: 'bookings',
    parentId: 'matchId',
    recordId: 'bookingId',
    dataName: 'booking'
  }),
  SEARCH ({ rootState }, { teamId }) {
    return http({
      method: 'post',
      path: myfifa.bookings.search,
      pathData: { teamId },
      token: rootState.token,
      success ({ data }) {
        Booking.insert({ data })
      }
    })
  }
}
