<template>
  <v-layout row wrap>
    <!-- Line Up -->
    <v-flex xs12 md6 v-if="match.team_result">
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
            </v-list-tile-title>
          </v-list-tile-content>

        </v-list-tile>

      </v-list>

    </v-flex>

    <!-- Match Events -->
    <v-flex xs12 md6>
      <v-list dense>
        <v-subheader>Match Log</v-subheader>

        <v-list-tile
          v-for="(event, i) in events"
          :key="i">
          <v-list-tile-action>
            <v-list-tile-action-text :class="teamColor(event)">{{ event.minute }}'</v-list-tile-action-text>
          </v-list-tile-action>

          <v-list-tile-avatar>
            <v-icon small :color="eventColor(event)">{{ eventIcon(event) }}</v-icon>
          </v-list-tile-avatar>

          <v-list-tile-content>
            <v-list-tile-title>{{ eventTitle(event) }}</v-list-tile-title>
            <v-list-tile-sub-title>{{ eventSubtitle(event) }}</v-list-tile-sub-title>
          </v-list-tile-content>

          <!-- <v-list-tile-action> -->
            <!-- <v-tooltip bottom> -->
              <!-- <v-btn slot="activator" icon @click="remove"> -->
                <!-- <v-icon>remove_circle</v-icon> -->
              <!-- </v-btn> -->
              <!-- Remove -->
            <!-- </v-tooltip> -->
          <!-- </v-list-tile-action> -->
        </v-list-tile>
      </v-list>
    </v-flex>
  </v-layout>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    props: [
      'match'
    ],
    data () {
      return {
      }
    },
    computed: {
      ...mapState('match', [
        'positions'
      ]),
      events () {
        return this.match.events.slice().sort()
      },
      sortedLogs () {
        return this.match.logs.slice().sort((a, b) => {
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
      teamColor (event) {
        return event.home ? 'teal--text' : 'pink--text'
      },
      eventColor (event) {
        switch (event.event_type) {
          case 'Goal':
            return 'blue'
          case 'Booking':
            return 'red'
          case 'Substitution':
            return 'green'
        }
      },
      eventIcon (event) {
        switch (event.event_type) {
          case 'Goal':
            return 'camera'
          case 'Booking':
            return 'book'
          case 'Substitution':
            return 'repeat'
        }
      },
      eventTitle (event) {
        switch (event.event_type) {
          case 'Goal':
            let desc = event.player_name
            if (event.penalty) {
              desc += ' (P)'
            } else if (event.own_goal) {
              desc += ' (OG)'
            }
            return desc
          case 'Booking':
          case 'Substitution':
            return event.player_name
        }
      },
      eventSubtitle (event) {
        switch (event.event_type) {
          case 'Goal':
            return event.assisted_by && event.assisted_by.length > 0
              ? 'Assisted by ' + event.assisted_by
              : ''
          case 'Booking':
            return event.red_card
              ? 'Red Card'
              : 'Yellow Card'
          case 'Substitution':
            return 'Replaced by ' + event.replaced_by
        }
      },
      numGoals (log) {
        return this.events
               .filter(event => event.event_type === 'Goal' && event.player_id === log.player_id)
               .length
      }
    }
  }
</script>
