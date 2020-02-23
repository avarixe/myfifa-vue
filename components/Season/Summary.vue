<template lang="pug">
  v-container
    v-row.text-center(justify="space-around" dense)
      v-col(cols=12 sm=6)
        season-team-growth(
          label="Team Value"
          attribute="value"
          :formatter="x => `${team.currency}${parseInt(x).toLocaleString()}`"
          :season-start="seasonStart"
          :season-end="seasonEnd"
        )
      v-col(cols=12 sm=6)
        season-team-growth(
          label="Team OVR"
          attribute="ovr"
          :formatter="parseInt"
          average
          :season-start="seasonStart"
          :season-end="seasonEnd"
        )
      v-col(cols=12)
        v-divider
      v-col(cols=4 sm=2)
        .display-1.success--text {{ numWins }}
        .subheading Wins
      v-col(cols=4 sm=2)
        .display-1.warning--text {{ numDraws }}
        .subheading Draws
      v-col(cols=4 sm=2)
        .display-1.red--text {{ numLosses }}
        .subheading Losses
      v-col(cols=6 sm=2)
        .display-1.teal--text {{ numGoalsFor }}
        .subheading Goals For
      v-col(cols=6 sm=2)
        .display-1.pink--text {{ numGoalsAgainst }}
        .subheading Goals Against
</template>

<script>
  import { addYears, format, parseISO } from 'date-fns'
  import { Match, Team } from '@/models'
  import { sum } from '@/functions'
  import SeasonTeamGrowth from './TeamGrowth'

  export default {
    name: 'SeasonSummary',
    components: {
      SeasonTeamGrowth
    },
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
