<template>
  <div>
    <div class="body-2">
      <v-menu
        :disabled="readonly || performance.start > 0"
        max-height="200px"
        offset-y
        offset-overflow
        lazy>
        <span slot="activator">
          {{ performance.name }}
        </span>

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
    </div>
    <div class="body-1">
      <v-menu
        :disabled="readonly"
        max-height="200px"
        offset-y
        offset-overflow
        lazy>
        <span slot="activator">
          {{ performance.pos }}
        </span>
        <v-list>
          <v-list-tile
            v-for="pos in positions"
            :key="pos"
            @click="setPosition(pos)">
            <v-list-tile-title>{{ pos }}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </div>
    <div>
      <v-icon
        v-if="parseInt(performance.start) > 0"
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
        small
      >mdi-soccer</v-icon>
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
        v-if="performance.subbed_out"
        color="red"
        small
      >mdi-subdirectory-arrow-left</v-icon>
    </div>
  </div>
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
      goals () {
        return this.events.filter(event => (
          event.event_type === 'Goal' &&
          event.player_id === this.performance.player_id &&
          !event.own_goal
        )).length
      },
      assists () {
        return this.events.filter(event => (
          event.event_type === 'Goal' &&
          event.assist_id === this.performance.player_id
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
