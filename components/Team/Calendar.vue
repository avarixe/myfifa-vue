<template>
  <v-row>
    <v-col
      cols="3"
      class="text-left"
    >
      <v-btn
        icon
        @click="$refs.calendar.prev()"
      >
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
    </v-col>
    <v-col
      cols="6"
      class="text-center"
    >
      <v-btn text>{{ currentMonth }}</v-btn>
    </v-col>
    <v-col
      cols="3"
      class="text-right"
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
            class="pa-1"
            style="background:transparent;"
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
                  >
                    {{ match.opponent }}
                  </fitty-text>
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
  import { mixins, Component } from 'nuxt-property-decorator'
  import { Match } from '@/models'
  import MatchCard from '@/components/Match/Card'
  import { FittyText } from '@/helpers'
  import { TeamAccessible } from '@/mixins'
  import { format } from 'date-fns'

  @Component({
    components: {
      FittyText,
      MatchCard
    }
  })
  export default class TeamCalendar extends mixins(TeamAccessible) {
    day = format(new Date(), 'YYYY-MM-DD')

    get currentMonth () {
      const date = this.$_parse(this.day)
      return this.$_format(date, 'MMMM YYYY')
    }

    mounted () {
      this.day = this.team.currently_on
    }

    matchesOn (date) {
      return Match
        .query()
        .with('team')
        .where('team_id', this.team.id)
        .where('played_on', date)
        .get()
    }
  }
</script>
