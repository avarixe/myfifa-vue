<template>
  <v-data-table
    :headers="headers"
    :items="rows"
    :items-per-page="-1"
    disable-sort
    hide-default-footer
  >
    <template #item.competition="{ item }">
      <v-btn
        :to="competitionLink(item.competition)"
        nuxt
        text
        color="info"
      >{{ item.competition }}</v-btn>
    </template>
  </v-data-table>
</template>

<script>
  import { Vue, Component, Prop } from 'nuxt-property-decorator'
  import { Competition } from '@/models'

  @Component
  export default class SeasonResultsTable extends Vue {
    @Prop({ type: Object, required: true }) seasonData

    headers = [
      { text: 'Competition', value: 'competition' },
      { text: 'GP', value: 'gp', align: 'center' },
      { text: 'W', value: 'wins', align: 'center' },
      { text: 'D', value: 'draws', align: 'center' },
      { text: 'L', value: 'losses', align: 'center' },
      { text: 'GF', value: 'gf', align: 'center' },
      { text: 'GA', value: 'ga', align: 'center' },
      { text: 'GD', value: 'gd', align: 'center' }
    ]

    get rows () {
      return Object.entries(this.seasonData.results)
        .map(([competition, data]) => ({
          ...data,
          competition,
          gp: data.wins + data.draws + data.losses,
          gd: data.gf - data.ga
        }))
    }

    competitionLink (competition) {
      const record = Competition
        .query()
        .where('season', parseInt(this.$route.params.season))
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
