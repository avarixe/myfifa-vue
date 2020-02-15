<template lang="pug">
  v-timeline-item(
    :color="color"
    icon="mdi-book"
    fill-dot
  )
    h2.headline.font-weight-light.my-0(:class="`${color}--text`")
      | {{ booking.minute }}"
      span.caption.text-truncate.mx-1(:class="`${captionColor}--text`")
        | {{ booking.home ? match.home : match.away }}
      template(v-if="!readonly")
        booking-form(:match="match" :record="booking")
          template(#default="{ on }")
            tooltip-button(
              label="Edit Booking"
              icon="mdi-pencil"
              color="orange"
              small
              :on="on"
            )
        |&nbsp;
        record-remove(
          :record="booking"
          store="bookings"
          :label="bookingType"
        )
    span.font-weight-bold {{ booking.player_name }}
    |&nbsp;
    | has received a {{ bookingType }}
</template>

<script>
  import BookingForm from '@/components/Booking/Form'

  export default {
    name: 'BookingEvent',
    components: {
      BookingForm
    },
    props: {
      match: {
        type: Object,
        required: true
      },
      booking: {
        type: Object,
        required: true
      },
      readonly: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      bookingType () {
        return this.booking.red_card ? 'Red Card' : 'Yellow Card'
      },
      color () {
        return this.booking.red_card ? 'red' : 'amber'
      },
      captionColor () {
        return this.booking.home ? 'teal' : 'pink'
      }
    }
  }
</script>
