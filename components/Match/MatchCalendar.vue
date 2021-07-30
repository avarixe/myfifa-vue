<template>
  <v-card>
    <v-toolbar
      color="transparent"
      flat
    >
      <v-btn
        outlined
        class="mr-4"
        color="grey darken-2"
        @click="day = team.currentlyOn"
      >
        Today
      </v-btn>
      <v-btn
        icon
        text
        small
        color="grey darken-2"
        @click="$refs.calendar.prev()"
      >
        <v-icon small>mdi-chevron-left</v-icon>
      </v-btn>
      <v-btn
        icon
        text
        small
        color="grey darken-2"
        @click="$refs.calendar.next()"
      >
        <v-icon small>mdi-chevron-right</v-icon>
      </v-btn>
      <v-toolbar-title
        v-if="$refs.calendar"
        class="ml-4"
      >
        {{ $refs.calendar.title }}
      </v-toolbar-title>
    </v-toolbar>

    <v-card-text>
      <div :style="{ overflowX: 'auto' }">
        <v-calendar
          ref="calendar"
          v-model="day"
          type="month"
          :now="team.currentlyOn"
          :events="events"
          event-start="playedOn"
          event-ripple
          :show-month-on-first="false"
          :style="{ minWidth: '700px' }"
          @click:event="viewMatch"
        >
          <template #event="{ event }">
            <div class="pl-1">
              <scroll-text :text="event.name" />
            </div>
          </template>
        </v-calendar>
      </div>
      <v-menu
        v-model="selectedOpen"
        :close-on-content-click="false"
        :activator="selectedElement"
        min-width="300"
        offset-y
        offset-overflow
      >
        <match-card
          :match="selectedEvent"
          :title="selectedEvent.competition"
          :color="selectedEvent.color"
          compact
        />
      </v-menu>
    </v-card-text>
  </v-card>
</template>

<script>
  import { TeamAccessible } from '@/mixins'

  const eventColors = [
    'blue',
    'purple',
    'cyan',
    'lime darken-2',
    'teal',
    'indigo',
    'blue-grey'
  ]

  export default {
    name: 'MatchCalendar',
    mixins: [
      TeamAccessible
    ],
    data: () => ({
      day: new Date(),
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      competitionColors: {}
    }),
    computed: {
      matches () {
        return this.$store.$db().model('Match')
          .query()
          .with('team')
          .where('teamId', this.teamId)
          .get()
      },
      events () {
        return this.matches.map(match => {
          if (!this.competitionColors[match.competition]) {
            this.$set(
              this.competitionColors,
              match.competition,
              eventColors[Object.keys(this.competitionColors).length % eventColors.length]
            )
          }
          return {
            ...match,
            name: match.stage
              ? `${match.competition} · ${match.stage}`
              : match.competition,
            color: this.competitionColors[match.competition],
            opponent: match.opponent,
            link: match.link
          }
        })
      }
    },
    mounted () {
      this.day = this.team.currentlyOn
    },
    methods: {
      viewMatch ({ nativeEvent, event }) {
        const open = () => {
          this.selectedEvent = event
          this.selectedElement = nativeEvent.target
          setTimeout(() => {
            this.selectedOpen = true
          }, 10)
        }

        if (this.selectedOpen) {
          this.selectedOpen = false
          setTimeout(open, 10)
        } else {
          open()
        }
      }
    }
  }
</script>
