<template>
  <v-timeline
    v-if="events.length > 0 || match.penalty_shootout"
    :dense="dense">
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
          <v-icon dark class="mr-3">mdi-{{ eventIcon(event) }}</v-icon>
          <span class="font-weight-bold pr-1 white--text text-uppercase">{{ eventTitle(event) }}</span>

          <v-spacer></v-spacer>

          <v-tooltip v-if="team.current_date === match.date_played" bottom>
            <v-btn
              slot="activator"
              @click="removeEvent(event)"
              :color="`${eventColor(event)} lighten-2`"
              class="ma-0"
              icon
              dark>
              <v-icon dark>mdi-close</v-icon>
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
      icon="mdi-human"
      color="indigo"
      fill-dot>
      <v-card>
        <v-card-title class="indigo lighten-2 py-1">
          <v-icon dark class="mr-3">mdi-human</v-icon>
          <span class="font-weight-bold pr-1 white--text text-uppercase">Penalty Shootout</span>

          <v-spacer></v-spacer>

          <v-tooltip v-if="team.current_date === match.date_played" bottom>
            <v-btn
              slot="activator"
              @click="removePS"
              color="indigo lighten-2"
              class="ma-0"
              icon
              dark>
              <v-icon dark>mdi-close</v-icon>
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
  import TimelineContent from './TimelineContent'
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
        return this.$_orderBy([
          ...this.match.bookings,
          ...this.match.substitutions,
          ...this.match.goals
        ],
        'minute',
        'asc')
      },
      penaltyShootoutEvent () {
        return this.match.penaltyShootout
          ? { ...this.match.penaltyShootout, event_type: 'PenaltyShootout' }
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
        removeGoal: 'entities/goals/REMOVE',
        removeBooking: 'entities/bookings/REMOVE',
        removeSubstitution: 'entities/substitutions/REMOVE',
        removePenaltyShootout: 'entities/penaltyShootout/REMOVE'
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
      async removePS () {
        if (confirm('Remove Penalty Shootout?')) {
          try {
            await this.removePenaltyShootout(this.match.id)
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
            return event.penalty ? 'alpha-p-box' : 'soccer'
          case 'Booking':
            return 'book'
          case 'Substitution':
            return event.injury ? 'hospital' : 'repeat'
          case 'PenaltyShootout':
            return 'human'
        }
      },
      eventTitle (event) {
        switch (event.event_type) {
          case 'Goal':
            if (event.own_goal) {
              return 'Own Goal'
            } else if (event.penalty) {
              return 'Penalty'
            } else {
              return 'Goal'
            }
          default:
            return event.event_type
        }
      }
    }
  }
</script>

<style scoped>
  .v-card > .container {
    padding: 8px;
  }
</style>
