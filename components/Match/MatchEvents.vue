<template>
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

        <v-list-tile-action v-if="team.current_date === match.date_played">
          <v-tooltip bottom>
            <v-btn slot="activator" icon @click="removeEvent(event)">
              <v-icon>remove_circle</v-icon>
            </v-btn>
            Remove
          </v-tooltip>
        </v-list-tile-action>

      </v-list-tile>
    </v-list>
  </v-flex>
</template>

<script>
  import TeamAction from '@/mixins/TeamAction'

  export default {
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
      events () {
        return this.match.events.slice().sort()
      }
    },
    methods: {
      removeEvent (event) {
        console.log('Removing event')
      },

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
      }
    }
  }
</script>
