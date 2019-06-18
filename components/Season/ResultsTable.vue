<template>
  <v-simple-table>
    <thead>
      <th class="text-xs-left">Competition</th>
      <th>GP</th>
      <th>W</th>
      <th>D</th>
      <th>L</th>
      <th>GF</th>
      <th>GA</th>
      <th>GD</th>
    </thead>
    <tbody>
      <tr
        v-for="item in rows"
        :key="item.competition"
      >
        <td class="text-xs-left">
          <a @click="competitionLink(item.competition)">
            {{ item.competition }}
          </a>
        </td>
        <td>{{ item.wins + item.draws + item.losses }}</td>
        <td>{{ item.wins }}</td>
        <td>{{ item.draws }}</td>
        <td>{{ item.losses }}</td>
        <td>{{ item.gf }}</td>
        <td>{{ item.ga }}</td>
        <td>{{ item.gf - item.ga }}</td>
      </tr>
    </tbody>
  </v-simple-table>
</template>

<script>
  import { Vue, Component, Prop } from 'nuxt-property-decorator'
  import { Competition } from '@/models'

  @Component
  export default class SeasonResultsTable extends Vue {
    @Prop({ type: Object, required: true }) seasonData

    get rows () {
      return Object.entries(this.seasonData.results)
        .map(([competition, data]) => ({
          ...data,
          competition
        }))
    }

    competitionLink (competition) {
      const record = Competition
        .query()
        .where('season', parseInt(this.$route.params.season))
        .where('name', competition)
        .get()

      if (record.length > 0) {
        this.$router.push({
          name: 'teams-teamId-competitions-competitionId',
          params: {
            teamId: this.$route.params.teamId,
            competitionId: record[0].id
          }
        })
      }
    }
  }
</script>

<style scoped>
  th, td {
    text-align: center;
  }
</style>
