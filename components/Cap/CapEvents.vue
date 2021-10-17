<script>
  import { toRefs, computed } from '@nuxtjs/composition-api'

  export default {
    name: 'CapEvents',
    props: {
      cap: { type: Object, required: true },
      match: { type: Object, required: true }
    },
    setup (props) {
      const { cap, match } = toRefs(props)

      const numGoals = computed(() =>
        match.value.goals
          .filter(goal => goal.playerId === cap.value.playerId && !goal.ownGoal)
          .length
      )

      const numAssists = computed(() =>
        match.value.goals
          .filter(goal => goal.assistId === cap.value.playerId)
          .length
      )

      const booking = computed(() => {
        const bookings = match.value.bookings.filter(booking =>
          booking.playerId === cap.value.playerId
        )

        if (bookings.some(b => b.redCard)) {
          return 'red'
        } else if (bookings.length > 0) {
          return 'yellow darken-2'
        } else {
          return null
        }
      })

      const injured = computed(() =>
        match.value.substitutions.some(sub =>
          sub.playerId === cap.value.playerId && sub.injury
        )
      )

      return {
        numGoals,
        numAssists,
        booking,
        injured
      }
    }
  }
</script>

<template>
  <div>
    <v-badge
      v-if="cap.start > 0"
      bottom
      overlap
      color="transparent"
    >
      <template #badge>
        <div class="counter font-weight-black">{{ cap.start }}'</div>
      </template>
      <v-icon
        color="green"
        small
      >
        mdi-subdirectory-arrow-right
      </v-icon>
    </v-badge>
    <v-badge
      v-if="numGoals > 0"
      bottom
      overlap
      color="transparent"
    >
      <template #badge>
        <div class="counter font-weight-black">{{ numGoals }}</div>
      </template>
      <v-icon
        color="blue"
        small
      >
        mdi-soccer
      </v-icon>
    </v-badge>
    <v-badge
      v-if="numAssists > 0"
      bottom
      overlap
      color="transparent"
    >
      <template #badge>
        <div class="counter font-weight-black">{{ numAssists }}</div>
      </template>
      <v-icon
        color="light-blue accent-1"
        small
      >
        mdi-human-greeting
      </v-icon>
    </v-badge>
    <v-icon
      v-if="booking"
      :color="booking"
      small
    >
      mdi-book
    </v-icon>
    <v-icon
      v-if="injured"
      color="pink"
      small
    >
      mdi-ambulance
    </v-icon>
    <v-badge
      v-if="cap.subbedOut"
      bottom
      overlap
      color="transparent"
    >
      <v-icon
        color="orange darken-2"
        small
      >
        mdi-subdirectory-arrow-left
      </v-icon>
      <template #badge>
        <div class="counter font-weight-black">{{ cap.stop }}'</div>
      </template>
    </v-badge>
  </div>
</template>

<style scoped lang="scss">
  .counter {
    color: black;

    .theme--dark & {
      color: white;
    }
  }
</style>
