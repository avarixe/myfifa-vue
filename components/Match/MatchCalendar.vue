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
          @change="updateFilters"
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
  import { gql } from 'nuxt-graphql-request'
  import { format, parseISO, startOfWeek, endOfWeek } from 'date-fns'
  import { TeamAccessible } from '@/mixins'
  import { matchFragment } from '@/fragments'

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
      competitionColors: {},

      // Server Side processing
      timeout: null,
      loading: false,
      items: [],
      filters: {
        startOn: null,
        endOn: null
      }
    }),
    computed: {
      events () {
        return this.items.map(match => {
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
      },
      searchParams () {
        return {
          teamId: parseInt(this.$route.query.teamId),
          pagination: {
            page: 0,
            itemsPerPage: 50
          },
          filters: this.filters
        }
      }
    },
    watch: {
      searchParams: {
        immediate: true,
        deep: true,
        handler () {
          clearTimeout(this.timeout)
          this.timeout = setTimeout(this.fetchMatchesPage, 300)
        }
      }
    },
    mounted () {
      this.day = this.team.currentlyOn
    },
    beforeDestroy () {
      clearTimeout(this.timeout)
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
      },
      updateFilters ({ start, end }) {
        this.filters.startOn = format(startOfWeek(parseISO(start.date)), 'yyyy-MM-dd')
        this.filters.endOn = format(endOfWeek(parseISO(end.date)), 'yyyy-MM-dd')
      },
      async fetchMatchesPage () {
        try {
          this.loading = true

          const query = gql`
              query fetchMatchesPage($teamId: ID!, $pagination: PaginationAttributes, $filters: MatchFilterAttributes) {
                team(id: $teamId) {
                  matchSet(pagination: $pagination, filters: $filters) {
                    matches { ...MatchData }
                  }
                }
              }
              ${matchFragment}
            `

          const { team: { matchSet } } =
            await this.$graphql.default.request(query, this.searchParams)

          await this.$store.$db().model('Match').insert({ data: matchSet.matches })
          this.items = this.$store.$db().model('Match')
            .query()
            .with('team')
            .where('id', matchSet.matches.map(match => parseInt(match.id)))
            .get()
        } catch (e) {
          console.error(e)
        } finally {
          this.loading = false
        }
      }
    }
  }
</script>
