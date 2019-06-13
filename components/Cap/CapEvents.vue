<template>
  <div>
    <v-icon
      v-if="parseInt(cap.start) > 0"
      color="green"
      small
    >mdi-subdirectory-arrow-right</v-icon>
    <v-icon
      v-for="index in goals"
      :key="`goal${index}`"
      color="blue"
      small
    >mdi-soccer</v-icon>
    <v-icon
      v-for="index in assists"
      :key="`assist${index}`"
      color="light-blue accent-1"
      small
    >mdi-human-greeting</v-icon>
    <v-icon
      v-for="(color, i) in bookings"
      :key="`booking${i}`"
      :color="color"
      small
    >mdi-book</v-icon>
    <v-icon
      v-if="injured"
      color="pink"
      small
    >mdi-hospital</v-icon>
    <v-icon
      v-if="cap.subbed_out"
      color="red"
      small
    >mdi-subdirectory-arrow-left</v-icon>
  </div>
</template>

<script>
  export default {
    props: {
      cap: {
        type: Object,
        required: true
      },
      match: {
        type: Object,
        required: true
      }
    },
    computed: {
      events () {
        return [
          ...this.match.substitutions,
          ...this.match.goals,
          ...this.match.bookings
        ]
      },
      goals () {
        return this.events.filter(event => (
          event.event_type === 'Goal' &&
          event.player_id === this.cap.player_id &&
          !event.own_goal
        )).length
      },
      assists () {
        return this.events.filter(event => (
          event.event_type === 'Goal' &&
          event.assist_id === this.cap.player_id
        )).length
      },
      bookings () {
        return this.events
          .filter(event => {
            return event.event_type === 'Booking' &&
              event.player_id === this.cap.player_id
          })
          .map(booking => booking.red_card ? 'red' : 'yellow darken-2')
      },
      injured () {
        return this.events
          .filter(event => (
            event.event_type === 'Substitution' &&
            event.player_id === this.cap.player_id &&
            event.injury
          )).length > 0
      }
    }
  }
</script>
