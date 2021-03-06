// actions
export const actions = {
  async create (_, { matchId, booking }) {
    const data = await this.$axios.$post(`matches/${matchId}/bookings`, {
      booking
    })
    this.$db().model('Booking').insert({ data })
  },
  async update (_, booking) {
    const data = await this.$axios.$patch(`bookings/${booking.id}`, {
      booking
    })
    this.$db().model('Booking').insert({ data })
  },
  async remove (_, bookingId) {
    await this.$axios.$delete(`bookings/${bookingId}`)
    this.$db().model('Booking').delete(bookingId)
  }
}
