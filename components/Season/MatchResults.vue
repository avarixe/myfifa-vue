<template>
  <v-card>
    <v-card-title primary-title>
      <div class="title">
        // MATCHES
      </div>
    </v-card-title>
    <v-card-text>
      <v-layout class="text-xs-center" row wrap>

        <v-flex xs12 md6>
          <pie-chart
            :data="resultsCount"
            label="Matches"
            :library="{ backgroundColor: 'transparent' }"
            class="g-chart"
          ></pie-chart>
        </v-flex>

        <v-flex xs12 md6>
          <v-data-table
            :headers="headers"
            :items="rows"
            item-key="id"
            no-data-text="No Matches Recorded"
            disable-initial-sort
            hide-actions>
            <template slot="items" slot-scope="props">
              <tr>
                <td
                  v-for="(header, i) in headers"
                  :key="i"
                  :class="`text-xs-${header.align}`">
                  {{ props.item[header.value] }}
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-flex>

      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
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
      resultsCount () {
        let wins = 0
        let losses = 0
        let draws = 0

        this.rows.forEach(results => {
          wins += results.wins || 0
          losses += results.losses || 0
          draws += results.draws || 0
        })

        return [
          ['Wins', wins],
          ['Losses', losses],
          ['Draws', draws]
        ]
      },
      rows () {
        return Object.entries(this.seasonData.results)
          .map(([competition, data]) => ({
            ...data,
            competition,
            gd: data.gf - data.ga,
            gp: data.wins + data.draws + data.losses
          }))
      }
    }
  }
</script>

<style scoped>
  >>> table.v-table tbody tr td {
    padding: 8px 16px;
    height: auto;
  }

  .g-chart {
    line-height: 0 !important;
  }
</style>
