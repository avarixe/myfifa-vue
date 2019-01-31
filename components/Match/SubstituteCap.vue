<template>
  <v-list-tile>
    <v-list-tile-action>
      <v-menu
        :disabled="readonly"
        max-height="200px"
        offset-y
        offset-overflow
        lazy
      >
        <span
          slot="activator"
          class="body-1"
          v-text="cap.pos"
        />
        <v-list>
          <v-list-tile
            v-for="pos in positions"
            :key="pos"
            @click="setPosition(pos)">
            <v-list-tile-title
              v-text="pos"
            />
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-list-tile-action>

    <v-list-tile-content>
      <v-list-tile-title>
        <span
          class="body-2"
          v-text="cap.name"
        />
        <v-icon
          v-if="parseInt(cap.start) > 0"
          color="green"
          small
          v-text="'mdi-subdirectory-arrow-right'"
        />
        <v-icon
          v-for="index in goals"
          :key="index"
          color="blue"
          small
          v-text="'mdi-soccer'"
        />
        <v-icon
          v-for="index in assists"
          :key="index"
          color="light-blue accent-1"
          small
          v-text="'mdi-human-greeting'"
        />
        <v-icon
          v-for="(color, i) in bookings"
          :key="i"
          :color="color"
          small
          v-text="'mdi-book'"
        />
        <v-icon
          v-if="injured"
          color="pink"
          small
          v-text="'mdi-hospital'"
        />
        <v-icon
          v-if="cap.subbed_out"
          color="red"
          small
          v-text="'mdi-subdirectory-arrow-left'"
        />
      </v-list-tile-title>
    </v-list-tile-content>
  </v-list-tile>
</template>

<script>
  import {
    mapState
  } from 'vuex'

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
      ...mapState('entities/matches', [
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
          .filter(event => event.event_type === 'Booking' && event.player_id === this.cap.player_id)
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
        this.$store.dispatch('entities/caps/UPDATE', {
          ...this.cap,
          pos: position
        })
      }
    }
  }
</script>
