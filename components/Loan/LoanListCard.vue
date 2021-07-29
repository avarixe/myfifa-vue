<template>
  <v-card>
    <v-toolbar
      color="indigo"
      dark
      dense
    >
      <v-toolbar-title class="font-weight-light">
        Loaned Players
      </v-toolbar-title>
    </v-toolbar>
    <v-simple-table>
      <thead>
        <tr>
          <th>Player</th>
          <th class="text-center">Position</th>
          <th class="text-right">Value</th>
          <th class="text-right">Transfer Fee</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="player in players"
          :key="player.id"
          v-ripple
          :class="rowColor(player)"
          @click="$router.push(`/teams/${team.id}/players/${player.id}`)"
        >
          <td>{{ player.name }}</td>
          <td class="text-center">{{ player.pos }}</td>
          <td class="text-right">{{ player.value | formatMoney(team.currency) }}</td>
          <td class="text-right">
            <span v-if="player.currentLoan.transferFee">
              {{ player.currentLoan.transferFee | formatMoney(team.currency) }}
            </span>
            <span v-if="player.currentLoan.addonClause">
              (+{{ player.currentLoan.addonClause }}%)
            </span>
          </td>
        </tr>
      </tbody>
    </v-simple-table>
  </v-card>
</template>

<script>
  export default {
    name: 'LoanListCard',
    props: {
      players: { type: Array, required: true },
      title: { type: String, required: true },
      color: { type: String, required: true }
    },
    computed: {
      team () {
        return this.$store.$db().model('Team')
          .find(parseInt(this.$route.params.teamId))
      }
    },
    methods: {
      rowColor (player) {
        return {
          'red--text': player.currentLoan.transferFee &&
            player.currentLoan.transferFee < player.value
        }
      }
    }
  }
</script>

<style scoped>
  tbody > tr {
    cursor: pointer;
  }
</style>
