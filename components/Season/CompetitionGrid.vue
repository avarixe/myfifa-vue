<template lang="pug">
  v-data-table(
    :headers="headers"
    :items="rows"
    :items-per-page="-1"
    :mobile-breakpoint="0"
    disable-sort
    hide-default-footer
  )
    template(#item.name="{ item }")
      nuxt-link(:to="item.link") {{ item.name }}
    template(#item.status="{ item }")
      v-icon(:color="item.statusColor" small) {{ item.statusIcon }}
</template>

<script>
  import { sum } from '@/helpers'
  import { Competition, Team } from '@/models'

  export default {
    name: 'SeasonCompetitionGrid',
    props: {
      season: {
        type: Number,
        required: true
      }
    },
    data: () => ({
      headers: [
        { text: 'Competition', value: 'name' },
        { text: '', value: 'status' },
        { text: 'GP', value: 'gp', align: 'center' },
        { text: 'W', value: 'wins', align: 'center' },
        { text: 'D', value: 'draws', align: 'center' },
        { text: 'L', value: 'losses', align: 'center' },
        { text: 'GF', value: 'gf', align: 'center' },
        { text: 'GA', value: 'ga', align: 'center' },
        { text: 'GD', value: 'gd', align: 'center' }
      ]
    }),
    computed: {
      team () {
        return Team.find(this.$route.params.teamId)
      },
      competitions () {
        return Competition
          .query()
          .with('team')
          .where('team_id', this.team.id)
          .where('season', this.season)
          .get()
      },
      rows () {
        return this.competitions.map(competition => {
          const matches = competition.matches

          const wins = matches
            .filter(match => match.team_result === 'win')
            .length
          const draws = matches
            .filter(match => match.team_result === 'draw')
            .length
          const losses = matches
            .filter(match => match.team_result === 'loss')
            .length

          const gf = sum(matches.map(match =>
            match.home === this.team.title ? match.home_score : match.away_score
          ))
          const ga = sum(matches.map(match =>
            match.home === this.team.title ? match.away_score : match.home_score
          ))

          return {
            name: competition.name,
            link: competition.link,
            statusIcon: competition.statusIcon,
            statusColor: competition.statusColor,
            gp: wins + draws + losses,
            wins,
            draws,
            losses,
            gf,
            ga,
            gd: gf - ga
          }
        })
      }
    },
    methods: {
      competitionLink (competition) {
        const record = Competition
          .query()
          .where('season', this.season)
          .where('name', competition)
          .get()

        if (record.length > 0) {
          return {
            name: 'teams-teamId-competitions-competitionId',
            params: {
              teamId: this.$route.params.teamId,
              competitionId: record[0].id
            }
          }
        }
      }
    }
  }
</script>
