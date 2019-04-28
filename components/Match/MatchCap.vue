<template>
  <div>
    <div class="body-2">
      <v-menu
        :disabled="readonly || cap.start > 0"
        max-height="200px"
        offset-y
        offset-overflow
        lazy
      >
        <template #activator="{ on }">
          <span v-on="on">{{ cap.name }}</span>
        </template>

        <v-list>
          <v-list-tile
            v-for="player in players"
            :key="player.id"
            @click="setPlayer(player.id)"
          >
            <v-list-tile-action>
              <v-list-tile-action-text>
                {{ player.pos }}
              </v-list-tile-action-text>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ player.name }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-menu>
    </div>
    <div class="body-1">
      <v-menu
        :disabled="readonly"
        max-height="200px"
        offset-y
        offset-overflow
        lazy
      >
        <template #activator="{ on }">
          <span v-on="on">{{ cap.pos }}</span>
        </template>

        <v-list>
          <v-list-tile
            v-for="pos in positions"
            :key="pos"
            @click="setPosition(pos)"
          >
            <v-list-tile-title>{{ pos }}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </div>
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
  </div>
</template>

<script>
  import {
    mapState,
    mapActions
  } from 'vuex'
  import { activePlayers } from '@/models/Player'

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
      players () {
        return activePlayers(parseInt(this.$route.params.teamId))
      },
      events () {
        return [
          ...this.match.goals,
          ...this.match.bookings,
          ...this.match.substitutions
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
      ...mapActions('caps', {
        update: 'UPDATE'
      }),
      setPosition (position) {
        this.update({
          ...this.cap,
          pos: position
        })
      },
      setPlayer (playerId) {
        this.update({
          ...this.cap,
          player_id: playerId
        })
      }
    }
  }
</script>
