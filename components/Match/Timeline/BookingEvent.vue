<template>
  <v-timeline-item
    :color="teamColor"
    icon="mdi-book"
    fill-dot
  >
    <template #icon>
      <v-sheet
        dark
        color="transparent"
        v-text="`${booking.minute}'`"
      />
    </template>
    <h2 class="font-weight-light my-0">
      <span :class="`text-caption text-truncate mx-1 ${teamColor}--text`">
        {{ booking.home ? match.home : match.away }}
      </span>
      <template v-if="!readonly">
        <booking-form
          :match="match"
          :record="booking"
          class="d-inline-block"
        >
          <template #default="{ on }">
            <tooltip-button
              label="Edit Booking"
              icon="mdi-pencil"
              color="orange"
              small
              :on="on"
            />
          </template>
        </booking-form>
        <record-remove
          :record="booking"
          store="bookings"
          :label="bookingType"
        />
      </template>
    </h2>

    <div>
      <v-icon
        :color="color"
        small
        left
      >
        mdi-book
      </v-icon>
      {{ booking.player_name }}
    </div>
  </v-timeline-item>
</template>

<script>
  export default {
    name: 'BookingEvent',
    props: {
      match: { type: Object, required: true },
      booking: { type: Object, required: true },
      readonly: { type: Boolean, default: false }
    },
    computed: {
      bookingType () {
        return this.booking.red_card ? 'Red Card' : 'Yellow Card'
      },
      color () {
        return this.booking.red_card ? 'red' : 'amber'
      },
      teamColor () {
        return this.booking.home ? 'teal' : 'purple'
      }
    }
  }
</script>
