<template>
  <v-list-tile>
    <v-list-tile-action>
      <v-menu
        :disabled="readonly"
        max-height="200px"
        offset-y
        offset-overflow
        lazy>
        <v-list-tile-action-text slot="activator">
          {{ performance.pos }}
        </v-list-tile-action-text>
        <v-list>
          <v-list-tile
            v-for="pos in positions"
            :key="pos"
            @click="setPosition(pos)">
            <v-list-tile-title>{{ pos }}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-list-tile-action>

    <v-list-tile-avatar>
      <v-icon small color="green" v-if="parseInt(performance.start) > 0">subdirectory_arrow_right</v-icon>
      <v-icon small color="red" v-if="performance.subbed_out">subdirectory_arrow_left</v-icon>
    </v-list-tile-avatar>

    <v-list-tile-content>
      <v-menu
        :disabled="readonly || performance.start > 0"
        max-height="200px"
        offset-y
        offset-overflow
        lazy>
        <v-list-tile-title slot="activator">
          {{ performance.name }}
          <v-icon
            v-for="index in numGoals"
            :key="index"
            color="blue"
            small
          >camera</v-icon>
          <v-icon
            v-for="(color, i) in bookings"
            :key="i"
            :color="color"
            small
          >book</v-icon>
          <v-icon
            v-if="injured"
            color="pink"
            small
          >local_hospital</v-icon>
        </v-list-tile-title>
        <v-list>
          <v-list-tile
            v-for="player in players"
            :key="player.id"
            @click="setPlayer(player.id)">
            <v-list-tile-action>
              <v-list-tile-action-text>{{ player.pos }}</v-list-tile-action-text>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ player.name }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-list-tile-content>
  </v-list-tile>
</template>

<script>
  import { mapState, mapGetters, mapActions } from 'vuex'

  export default {
    props: {
      performance: {
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
      ...mapState('match', [
        'positions'
      ]),
      ...mapGetters('player', {
        players: 'active'
      }),
      events () {
        return this.match.events.slice().sort()
      },
      numGoals () {
        return this.events.filter(event => (
          event.event_type === 'Goal' &&
          event.player_id === this.performance.player_id &&
          !event.own_goal
        )).length
      },
      bookings () {
        return this.events
          .filter(event => event.event_type === 'Booking' && event.player_id === this.performance.player_id)
          .map(booking => booking.red_card ? 'red' : 'yellow darken-2')
      },
      injured () {
        return this.events
          .filter(event => (
            event.event_type === 'Substitution' &&
            event.player_id === this.performance.player_id &&
            event.injury
          )).length > 0
      }
    },
    methods: {
      ...mapActions('performance', [
        'update'
      ]),
      setPosition (position) {
        this.update({
          ...this.performance,
          pos: position
        })
      },
      setPlayer (playerId) {
        this.update({
          ...this.performance,
          player_id: playerId
        })
      }
    }
  }
</script>
