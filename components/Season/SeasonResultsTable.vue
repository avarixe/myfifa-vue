<template>
  <v-data-table
    :headers="headers"
    :items="rows"
    item-key="id"
    no-data-text="No Matches Recorded"
    disable-initial-sort
    hide-actions
  >
    <template #headerCell="{ header }">
      <span class="subheading font-weight-light text-success text--darken-3">{{ header.text }}</span>
    </template>
    <template #items="{ item }">
      <tr>
        <td
          v-for="(header, i) in headers"
          :key="i"
          :class="`text-xs-${header.align}`"
        >
          <a
            v-if="header.value === 'competition'"
            @click="competitionLink(item[header.value])"
            class="blue-grey--text"
          >{{ item[header.value] }}</a>
          <span
            v-else
          >{{ item[header.value] }}</span>
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script>
  import { Competition } from '@/models'

  export default {
    props: {
      seasonData: {
        type: Object,
        required: true
      }
    },
    data: () => ({
      headers: [
        { text: 'Competition', value: 'competition', align: 'left', sortable: false },
        { text: 'GP', value: 'gp',     align: 'center', sortable: false },
        { text: 'W',  value: 'wins',   align: 'center', sortable: false },
        { text: 'D',  value: 'draws',  align: 'center', sortable: false },
        { text: 'L',  value: 'losses', align: 'center', sortable: false },
        { text: 'GF', value: 'gf',     align: 'center', sortable: false },
        { text: 'GA', value: 'ga',     align: 'center', sortable: false },
        { text: 'GD', value: 'gd',     align: 'center', sortable: false }
      ]
    }),
    computed: {
      rows () {
        return Object.entries(this.seasonData.results)
          .map(([competition, data]) => ({
            ...data,
            competition,
            gd: data.gf - data.ga,
            gp: data.wins + data.draws + data.losses
          }))
      }
    },
    methods: {
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
  }
</script>

<style scoped>
  >>> table.v-table tbody tr td {
    padding: 8px 16px;
    height: auto;
  }
</style>
