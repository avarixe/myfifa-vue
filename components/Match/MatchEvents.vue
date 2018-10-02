<template>
  <v-flex xs12 sm6>
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

        <v-list-tile-action v-if="team.current_date === match.date_played">
          <v-tooltip bottom>
            <v-btn slot="activator" small icon @click="removeEvent(event)">
              <v-icon small>remove_circle</v-icon>
            </v-btn>
            Remove
          </v-tooltip>
        </v-list-tile-action>
      </v-list-tile>

      <v-list-tile v-if="match.penalty_shootout">
        <!-- Blank Action for alignment -->
        <v-list-tile-action></v-list-tile-action>

        <v-list-tile-avatar>
          <v-icon small color="indigo">accessibility_new</v-icon>
        </v-list-tile-avatar>

        <v-list-tile-content>
          <v-list-tile-title>Penalty Shootout</v-list-tile-title>
          <v-list-tile-sub-title>
            {{ match.penalty_shootout.home_score }} - {{ match.penalty_shootout.away_score }}
          </v-list-tile-sub-title>
        </v-list-tile-content>

        <v-list-tile-action v-if="team.current_date === match.date_played">
          <v-tooltip bottom>
            <v-btn slot="activator" small icon @click="removeEvent(penaltyShootoutEvent)">
              <v-icon small>remove_circle</v-icon>
            </v-btn>
            Remove
          </v-tooltip>
        </v-list-tile-action>
      </v-list-tile>
    </v-list>
  </v-flex>
</template>

<script>
  import { mapActions } from 'vuex'
  import TeamAccessible from '@/mixins/TeamAccessible'

  export default {
    mixins: [ TeamAccessible ],
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
      events () {
        return [ ...this.match.events ]
      },
      penaltyShootoutEvent () {
        return this.match.penalty_shootout
          ? { id: this.match.penalty_shootout.id, event_type: 'PenaltyShootout' }
          : {}
      }
    },
    methods: {
      ...mapActions({
        removeGoal: 'goal/remove',
        removeBooking: 'booking/remove',
        removeSubstitution: 'substitution/remove',
        removePenaltyShootout: 'penaltyShootout/remove'
      }),
      async removeEvent (event) {
        if (confirm('Remove ' + event.event_type + '?')) {
          try {
            await this['remove' + event.event_type](event.id)
          } catch (e) {
            alert(e.message)
          }
        }
      },

      teamColor (event) {
        return event.home ? 'teal--text' : 'pink--text'
      },
      eventColor (event) {
        switch (event.event_type) {
          case 'Goal':
            return event.own_goal ? 'gray' : 'blue'
          case 'Booking':
            return event.red_card ? 'red' : 'yellow darken-2'
          case 'Substitution':
            return event.injury ? 'pink' : 'green'
        }
      },
      eventIcon (event) {
        switch (event.event_type) {
          case 'Goal':
            return event.penalty ? 'filter_tilt_shift' : 'camera'
          case 'Booking':
            return 'book'
          case 'Substitution':
            return event.injury ? 'local_hospital' : 'repeat'
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
      }
    }
  }
</script>
