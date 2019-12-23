<template lang="pug">
  div
    v-icon(
      v-if="parseInt(cap.start) > 0"
      color="green"
      small
    ) mdi-subdirectory-arrow-right
    v-icon(
      v-for="index in goals"
      :key="`goal${index}`"
      color="blue"
      small
    ) mdi-soccer
    v-icon(
      v-for="index in assists"
      :key="`assist${index}`"
      color="light-blue accent-1"
      small
    ) mdi-human-greeting
    v-icon(
      v-for="(color, i) in bookings"
      :key="`booking${i}`"
      :color="color"
      small
    ) mdi-book
    v-icon(
      v-if="injured"
      color="pink"
      small
    ) mdi-ambulance
    v-icon(
      v-if="cap.subbed_out"
      color="red"
      small
    ) mdi-subdirectory-arrow-left
</template>

<script>
  export default {
    name: 'CapEvents',
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
      goals () {
        return this.match.goals
          .filter(g => g.player_id === this.cap.player_id && !g.own_goal)
          .length
      },
      assists () {
        return this.match.goals
          .filter(g => g.assist_id === this.cap.player_id)
          .length
      },
      bookings () {
        return this.match.bookings
          .filter(b => b.player_id === this.cap.player_id)
          .map(b => b.red_card ? 'red' : 'yellow darken-2')
      },
      injured () {
        return this.match.substitutions.some(s =>
          s.player_id === this.cap.player_id && s.injury
        )
      }
    }
  }
</script>
