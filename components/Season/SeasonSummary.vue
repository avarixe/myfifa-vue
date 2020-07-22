<template>
  <v-container>
    <v-row
      class="text-center"
      justify="space-around"
      dense
    >
      <v-col
        cols="12"
        sm="6"
      >
        <season-team-growth
          label="Team Value"
          attribute="value"
          :formatter="x => `${team.currency}${parseInt(x).toLocaleString()}`"
          :season-start="seasonStart"
          :season-end="seasonEnd"
        />
      </v-col>
      <v-col
        cols="12"
        sm="6"
      >
        <season-team-growth
          label="Team OVR"
          attribute="ovr"
          :formatter="parseInt"
          average
          :season-start="seasonStart"
          :season-end="seasonEnd"
        />
      </v-col>
      <v-col cols="12">
        <v-divider />
      </v-col>
      <v-col
        cols="4"
        sm="2"
      >
        <div class="text-h4 success--text">{{ numWins }}</div>
        <div class="subheading">Wins</div>
      </v-col>
      <v-col
        cols="4"
        sm="2"
      >
        <div class="text-h4 warning--text">{{ numDraws }}</div>
        <div class="subheading">Draws</div>
      </v-col>
      <v-col
        cols="4"
        sm="2"
      >
        <div class="text-h4 red--text">{{ numLosses }}</div>
        <div class="subheading">Losses</div>
      </v-col>
      <v-col
        cols="6"
        sm="2"
      >
        <div class="text-h4 teal--text">{{ numGoalsFor }}</div>
        <div class="subheading">Goals For</div>
      </v-col>
      <v-col
        cols="6"
        sm="2"
      >
        <div class="text-h4 pink--text">{{ numGoalsAgainst }}</div>
        <div class="subheading">Goals Against</div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { addYears, format, parseISO } from 'date-fns'
  import { Match, Team } from '@/models'
  import { sum } from '@/functions'

  export default {
    name: 'SeasonSummary',
    props: {
      season: { type: [String, Number], required: true }
    },
    computed: {
      team () {
        return Team.find(this.$route.params.teamId)
      },
      seasonStart () {
        let date = parseISO(this.team.started_on)
        date = addYears(date, parseInt(this.season))
        return format(date, 'yyyy-MM-dd')
      },
      seasonEnd () {
        let date = parseISO(this.team.started_on)
        date = addYears(date, parseInt(this.season) + 1)
        return format(date, 'yyyy-MM-dd')
      },
      matches () {
        return Match
          .query()
          .where('team_id', this.team.id)
          .where('played_on', date => {
            return this.seasonStart <= date && date < this.seasonEnd
          })
          .get()
      },
      numWins () {
        return this.matches.filter(match => match.team_result === 'win').length
      },
      numDraws () {
        return this.matches.filter(match => match.team_result === 'draw').length
      },
      numLosses () {
        return this.matches.filter(match => match.team_result === 'loss').length
      },
      numGoalsFor () {
        return sum(this.matches.map(match =>
          match.home === this.team.title ? match.home_score : match.away_score
        ))
      },
      numGoalsAgainst () {
        return sum(this.matches.map(match =>
          match.home === this.team.title ? match.away_score : match.home_score
        ))
      }
    }
  }
</script>
