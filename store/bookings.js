import { Booking } from '@/models'

// actions
export const actions = {
  async CREATE (_, { matchId, booking }) {
    const data = await this.$axios.$post(`matches/${matchId}/bookings`, {
      booking
    })
    Booking.insert({ data })
  },
  async UPDATE (_, booking) {
    const data = await this.$axios.$patch(`bookings/${booking.id}`, {
      booking
    })
    Booking.insert({ data })
  },
  async REMOVE (_, bookingId) {
    await this.$axios.$delete(`bookings/${bookingId}`)
    Booking.delete(bookingId)
  }
}
