<template>
  <v-timeline :dense="dense">
    <v-timeline-item
      v-for="(event, i) in events"
      :key="i"
      :color="teamColor(event)"
      :left="event.home"
      :right="!event.home"
      fill-dot>
      <span class="white--text" slot="icon">{{ event.minute }}'</span>
      <v-card>
        <v-card-title :class="`${eventColor(event)} lighten-2 py-1`">
          <v-icon dark class="mr-3">{{ eventIcon(event) }}</v-icon>
          <span class="font-weight-bold pr-1 white--text text-uppercase">{{ eventTitle(event) }}</span>

          <v-spacer></v-spacer>

          <v-tooltip v-if="team.current_date === match.date_played" bottom>
            <v-btn
              slot="activator"
              icon
              class="ma-0"
              @click="removeEvent(event)">
              <v-icon dark>remove_circle</v-icon>
            </v-btn>
            Remove
          </v-tooltip>
        </v-card-title>
        <v-container>
          <v-layout>
            <v-flex xs12>
              <timeline-content :item="event"></timeline-content>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-timeline-item>

    <v-timeline-item
      v-if="match.penalty_shootout"
      icon="accessibility_new"
      color="indigo"
      fill-dot>
      <v-card>
        <v-card-title class="indigo lighten-2 py-1">
          <v-icon dark clas="mr-3">accessibility_new</v-icon>
          <span class="font-weight-bold pr-1 white--text text-uppercase">Penalty Shootout</span>

          <v-spacer></v-spacer>

          <v-tooltip v-if="team.current_date === match.date_played" bottom>
            <v-btn
              slot="activator"
              icon
              class="ma-0"
              @click="removeEvent(penaltyShootoutEvent)">
              <v-icon dark>remove_circle</v-icon>
            </v-btn>
            Remove
          </v-tooltip>
        </v-card-title>
        <v-container>
          <v-layout>
            <v-flex xs12>
              <timeline-content :item="penaltyShootoutEvent"></timeline-content>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-timeline-item>
  </v-timeline>
</template>

<script>
  import TimelineContent from '@/components/Match/Timeline/TimelineContent'
  import { mapActions } from 'vuex'
  import TeamAccessible from '@/mixins/TeamAccessible'

  export default {
    mixins: [ TeamAccessible ],
    components: {
      TimelineContent
    },
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
          ? { ...this.match.penalty_shootout, event_type: 'PenaltyShootout' }
          : {}
      },
      dense () {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs':
          case 'sm':
            return true
          default:
            return false
        }
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
        return event.home ? 'teal' : 'pink'
      },
      eventColor (event) {
        switch (event.event_type) {
          case 'Goal':
            return event.own_goal ? 'light-blue' : 'blue'
          case 'Booking':
            return event.red_card ? 'red' : 'yellow darken-2'
          case 'Substitution':
            return event.injury ? 'pink' : 'green'
          case 'PenaltyShootout':
            return 'indigo'
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
          case 'PenaltyShootout':
            return 'accessibility_new'
        }
      },
      eventTitle (event) {
        switch (event.event_type) {
          case 'Goal':
            if (event.own_goal) {
              return 'Own Goal'
            } else if (event.penalty) {
              return 'Penalty'
            }
          default:
            return event.event_type
        }
      }
    }
  }
</script>
