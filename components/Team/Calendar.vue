<template>
  <v-layout wrap>
    <v-flex
      xs3
      class="text-xs-left"
    >
      <v-btn
        icon
        @click="$refs.calendar.prev()"
      >
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
    </v-flex>
    <v-flex
      xs6
      class="text-xs-center"
    >
      <v-btn text>{{ currentMonth }}</v-btn>
    </v-flex>
    <v-flex
      xs3
      class="text-xs-right"
    >
      <v-btn
        icon
        @click="$refs.calendar.next()"
      >
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </v-flex>

    <v-flex xs12>
      <v-calendar
        ref="calendar"
        v-model="day"
        type="month"
        :now="team.current_date"
        :start="team.start_date"
        :show-month-on-first="false"
      >
        <template #day="{ date }">
          <v-dialog
            v-for="match in matchesOn(date)"
            :key="match.id"
            width="500"
          >
            <template #activator="{ on }">
              <a
                v-on="on"
                v-ripple
                class="d-block text-xs-center"
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
              color="info"
            />
          </v-dialog>
        </template>
      </v-calendar>
    </v-flex>
  </v-layout>
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
      this.day = this.team.current_date
    }

    matchesOn (date) {
      return Match
        .query()
        .with('team')
        .where('team_id', this.team.id)
        .where('date_played', date)
        .get()
    }

    goToMatch (match) {
      this.$router.push({
        name: 'teams-teamId-matches-matchId',
        params: {
          teamId: this.team.id,
          matchId: match.id
        }
      })
    }
  }
</script>

<style scoped>
  .v-calendar .v-btn {
    padding: 3px 5px;
    text-align: left;
  }
  >>> .v-calendar .v-btn .v-btn__content {
    justify-content: normal;
    text-transform: none;
  }

  .calendar-event {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    border-radius: 2px;
    width: 100%;
    font-size: 12px;
    padding: 3px;
    cursor: pointer;
    margin-bottom: 1px;
  }
</style>
