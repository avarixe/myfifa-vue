<template>
  <v-row>
    <v-col
      class="text-left"
      cols="3"
    >
      <v-btn
        icon
        @click="$refs.calendar.prev()"
      >
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
    </v-col>
    <v-col
      class="text-center"
      cols="6"
    >
      <v-btn text>{{ currentMonth }}</v-btn>
    </v-col>
    <v-col
      class="text-right"
      cols="3"
    >
      <v-btn
        icon
        @click="$refs.calendar.next()"
      >
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </v-col>
    <v-col cols="12">
      <v-calendar
        ref="calendar"
        v-model="day"
        type="month"
        :now="team.currently_on"
        :start="team.started_on"
        :show-month-on-first="false"
      >
        <template #day="{ date }">
          <v-sheet
            v-for="match in matchesOn(date)"
            :key="match.id"
            tile
            class="pa-1 transparent"
          >
            <v-dialog width="500">
              <template #activator="{ on }">
                <a
                  class="d-block text-center"
                  v-on="on"
                >
                  <fitty-text
                    :text="match.opponent"
                    :max-size="14"
                  />
                </a>
              </template>
              <match-card
                :match="match"
                :title="`${match.home} v ${match.away}`"
                color="light-blue"
              />
            </v-dialog>
          </v-sheet>
        </template>
      </v-calendar>
    </v-col>
  </v-row>
</template>

<script>
  import { Match } from '@/models'
  import { TeamAccessible } from '@/mixins'
  import { format, parseISO } from 'date-fns'

  export default {
    name: 'TeamCalendar',
    mixins: [
      TeamAccessible
    ],
    data: () => ({
      day: format(new Date(), 'yyyy-MM-dd')
    }),
    computed: {
      currentMonth () {
        return format(parseISO(this.day), 'MMMM yyyy')
      }
    },
    mounted () {
      this.day = this.team.currently_on
    },
    methods: {
      matchesOn (date) {
        return Match
          .query()
          .with('team')
          .where('team_id', this.team.id)
          .where('played_on', date)
          .get()
      }
    }
  }
</script>
