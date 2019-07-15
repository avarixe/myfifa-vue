<template>
  <v-data-table
    :headers="headers"
    :items="rows"
    :items-per-page="-1"
    disable-sort
    hide-default-footer
  >
    <template #item.name="{ item }">
      <v-btn
        :to="item.link"
        nuxt
        text
        color="info"
      >{{ item.name }}</v-btn>
    </template>
  </v-data-table>
</template>

<script>
  import { Vue, Component, Prop } from 'nuxt-property-decorator'
  import { Competition, Team } from '@/models'

  @Component
  export default class SeasonResultsTable extends Vue {
    @Prop({ type: Number, required: true }) season

    headers = [
      { text: 'Competition', value: 'name' },
      { text: 'GP', value: 'gp', align: 'center' },
      { text: 'W', value: 'wins', align: 'center' },
      { text: 'D', value: 'draws', align: 'center' },
      { text: 'L', value: 'losses', align: 'center' },
      { text: 'GF', value: 'gf', align: 'center' },
      { text: 'GA', value: 'ga', align: 'center' },
      { text: 'GD', value: 'gd', align: 'center' }
    ]

    get team () {
      return Team.find(this.$route.params.teamId)
    }

    get competitions () {
      return Competition
        .query()
        .with('team')
        .where('season', this.season)
        .get()
    }

    get rows () {
      return this.competitions.map(competition => {
        const matches = competition.matches

        const wins = matches.filter(m => m.team_result === 'win').length
        const draws = matches.filter(m => m.team_result === 'draw').length
        const losses = matches.filter(m => m.team_result === 'loss').length

        const gf = this.$_sum(matches.map(m =>
          m.home === this.team.title ? m.home_score : m.away_score
        ))
        const ga = this.$_sum(matches.map(m =>
          m.home === this.team.title ? m.away_score : m.home_score
        ))

        return {
          name: competition.name,
          link: competition.link,
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
</script>
