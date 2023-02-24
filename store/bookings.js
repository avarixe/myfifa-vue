import { gql } from 'nuxt-graphql-request'
import { bookingFragment } from '~/fragments'

// actions
export const actions = {
  async create (_, { matchId, attributes }) {
    const query = gql`
      mutation createBooking($matchId: ID!, $attributes: BookingAttributes!) {
        addBooking(matchId: $matchId, attributes: $attributes) {
          booking { ...BookingData }
        }
      }
      ${bookingFragment}
    `

    await this.$graphql.default.request(query, { matchId, attributes })
  },
  async update (_, { id, attributes }) {
    const query = gql`
      mutation ($id: ID!, $attributes: BookingAttributes!) {
        updateBooking(id: $id, attributes: $attributes) {
          booking { ...BookingData }
        }
      }
      ${bookingFragment}
    `

    await this.$graphql.default.request(query, { id, attributes })
  },
  async remove (_, id) {
    const query = gql`
      mutation removeBooking($id: ID!) {
        removeBooking(id: $id) {
          booking { ...BookingData }
        }
      }
      ${bookingFragment}
    `

    await this.$graphql.default.request(query, { id })

    this.$db().model('Booking').delete(id)
  }
}
