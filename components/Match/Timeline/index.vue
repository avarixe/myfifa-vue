<template>
  <v-timeline
    v-if="events.length > 0 || match.penalty_shootout"
    :dense="dense"
  >
    <v-timeline-item
      v-for="(event, i) in events"
      :key="i"
      :color="eventColor(event)"
      :left="event.home"
      :right="!event.home"
      :icon="`mdi-${eventIcon(event)}`"
      fill-dot
    >
      <h2
        :class="`headline font-weight-light my-0 ${eventColor(event)}--text`"
      >
        {{ event.minute }}"

        <span
          class="caption text-truncate"
        >{{ event.home ? match.home : match.away }}</span>

        <v-tooltip
          v-if="team.current_date === match.date_played"
          bottom
        >
          <v-btn
            slot="activator"
            class="ma-0"
            icon
            @click="removeEvent(event)"
          >
            <v-icon
              :color="eventColor(event)"
            >mdi-close</v-icon>
          </v-btn>
          Remove
        </v-tooltip>
      </h2>

      <v-divider
        :class="`ma-0 ${eventColor(event)}--text`"
        :style="dividerStyle"
      />

      <timeline-content
        :item="event"
      />
    </v-timeline-item>

    <v-timeline-item
      v-if="match.penalty_shootout"
      icon="mdi-human"
      color="indigo"
      fill-dot
    >
      <h2
        class="headline font-weight-light my-0 indigo--text"
      >
        Penalty Shootout

        <v-tooltip
          v-if="team.current_date === match.date_played"
          bottom
        >
          <v-btn
            slot="activator"
            color="indigo lighten-2"
            class="ma-0"
            icon
            @click="removePS"
          >
            <v-icon
              color="indigo"
            >mdi-close</v-icon>
          </v-btn>
          Remove
        </v-tooltip>
      </h2>

      <v-divider
        class="ma-0 indigo--text"
        :style="dividerStyle"
      />

      <timeline-content
        :item="penaltyShootoutEvent"
      />
    </v-timeline-item>
  </v-timeline>
</template>

<script>
  import TimelineContent from './TimelineContent'
  import {
    mapActions
  } from 'vuex'
  import {
    TeamAccessible
  } from '@/mixins'

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
      return {
        dividerStyle: {
          'border-color': 'inherit',
          'border-width': 'thin 0 0'
        }
      }
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
        return this.match.penalty_shootout
          ? { ...this.match.penalty_shootout, event_type: 'PenaltyShootout' }
          : {}
      },
      dense () {
        switch (this.$vuetify.breakpoint.name) {
          case 'lg':
          case 'xl':
            return false
          default:
            return true
        }
      }
    },
    methods: {
      ...mapActions({
        removeGoal: 'entities/goals/REMOVE',
        removeBooking: 'entities/bookings/REMOVE',
        removeSubstitution: 'entities/substitutions/REMOVE',
        removePenaltyShootout: 'entities/penaltyShootouts/REMOVE'
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
            return event.red_card ? 'red' : 'amber'
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
