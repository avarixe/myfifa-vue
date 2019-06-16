import { crud, http, routes } from '@/api'
import { Booking } from '@/models'

// actions
export const actions = {
  ...crud({
    model: Booking,
    parent: 'match'
  }),
  SEARCH ({ rootState }, { teamId }) {
    return http({
      method: 'post',
      path: routes.bookings.search,
      pathData: { teamId },
      token: rootState.token,
      success ({ data }) {
        Booking.insert({ data })
      }
    })
  }
}
