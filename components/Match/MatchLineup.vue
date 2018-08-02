<template>
  <v-flex xs12 md6>
    <v-list dense>
      <v-subheader>Lineup</v-subheader>

      <v-list-tile
        v-for="(player, i) in sortedLogs"
        :key="i">

        <v-list-tile-action>
          <v-list-tile-action-text>{{ player.pos }}</v-list-tile-action-text>
        </v-list-tile-action>

        <v-list-tile-avatar>
          <v-icon small color="green" v-if="parseInt(player.start) > 0">subdirectory_arrow_right</v-icon>
          <v-icon small color="red" v-if="player.subbed_out">subdirectory_arrow_left</v-icon>
        </v-list-tile-avatar>

        <v-list-tile-content>
          <v-list-tile-title>
            {{ player.name }}
            <v-icon
              v-for="index in numGoals(player)"
              :key="index"
              color="blue"
              small
            >camera</v-icon>
            <v-icon
              v-for="(color, i) in bookings(player)"
              :key="i"
              :color="color"
              small
            >book</v-icon>
            <v-icon
              v-if="injured(player)"
              color="pink"
              small
            >local_hospital</v-icon>
          </v-list-tile-title>
        </v-list-tile-content>

        <v-list-tile-action v-if="team.current_date === match.date_played">
          <performance-form :match="match" :performance-id="player.id">
            <v-tooltip bottom>
              <v-btn slot="activator" small icon>
                <v-icon small>edit</v-icon>
              </v-btn>
              Edit
            </v-tooltip>
          </performance-form>
        </v-list-tile-action>

      </v-list-tile>
    </v-list>
  </v-flex>
</template>

<script>
  import { mapState } from 'vuex'
  import TeamAction from '@/mixins/TeamAction'
  import PerformanceForm from '@/components/Match/PerformanceForm'

  export default {
    components: {
      'performance-form': PerformanceForm
    },
    mixins: [ TeamAction ],
    props: {
      match: {
        type: Object,
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
      events () {
        return this.match.events.slice().sort()
      },
      sortedLogs () {
        return this.match.performances.slice().sort((a, b) => {
          if (this.positions.indexOf(a.pos) > this.positions.indexOf(b.pos)) {
            return 1
          } else if (this.positions.indexOf(a.pos) < this.positions.indexOf(b.pos)) {
            return -1
          } else {
            return a.start >= b.start
          }
        })
      }
    },
    methods: {
      numGoals (log) {
        return this.events.filter(event => (
          event.event_type === 'Goal' &&
          event.player_id === log.player_id &&
          !event.own_goal
        )).length
      },
      bookings (log) {
        return this.events
          .filter(event => event.event_type === 'Booking' && event.player_id === log.player_id)
          .map(booking => booking.red_card ? 'red' : 'yellow darken-2')
      },
      injured (log) {
        return this.events
          .filter(event => (
            event.event_type === 'Substitution' &&
            event.player_id === log.player_id &&
            event.injury
          )).length > 0
      }
    }
  }
</script>
