<template>
  <v-list-item>
    <v-list-item-action>
      <v-menu
        :disabled="readonly"
        max-height="200px"
        offset-y
        offset-overflow
      >
        <template #activator="{ on }">
          <span
            v-on="on"
            class="body-1"
          >{{ cap.pos }}</span>
        </template>
        <v-list>
          <v-list-item
            v-for="pos in positions"
            :key="pos"
            @click="setPosition(pos)">
            <v-list-item-title>{{ pos }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-list-item-action>

    <v-list-item-content>
      <v-list-item-title>
        <span class="body-2">{{ cap.name }}</span>
        <v-icon
          v-if="parseInt(cap.start) > 0"
          color="green"
          small
        >mdi-subdirectory-arrow-right</v-icon>
        <v-icon
          v-for="index in goals"
          :key="index"
          color="blue"
          small
        >mdi-soccer</v-icon>
        <v-icon
          v-for="index in assists"
          :key="index"
          color="light-blue accent-1"
          small
        >mdi-human-greeting</v-icon>
        <v-icon
          v-for="(color, i) in bookings"
          :key="i"
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
      </v-list-item-title>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    props: {
      cap: {
        type: Object,
        required: true
      },
      match: {
        type: Object,
        required: true
      },
      readonly: {
        type: Boolean,
        required: true
      }
    },
    data () {
      return {}
    },
    computed: {
      ...mapState('matches', [
        'positions'
      ]),
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
    },
    methods: {
      setPosition (position) {
        this.$store.dispatch('caps/UPDATE', {
          ...this.cap,
          pos: position
        })
      }
    }
  }
</script>
