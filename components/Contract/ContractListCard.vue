<template>
  <v-card>
    <v-toolbar
      :color="color"
      dark
      dense
    >
      <v-toolbar-title class="font-weight-light">
        {{ title }}
      </v-toolbar-title>
    </v-toolbar>
    <v-simple-table>
      <thead>
        <tr>
          <th>Player</th>
          <th class="text-center">Position</th>
          <th class="text-right">Value</th>
          <th class="text-right">Wage</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="player in players"
          :key="player.id"
          v-ripple
          @click="$router.push(`/teams/${team.id}/players/${player.id}`)"
        >
          <td>{{ player.name }}</td>
          <td class="text-center">{{ player.pos }}</td>
          <td class="text-right">
            {{ player.value | formatMoney(team.currency) }}
          </td>
          <td class="text-right">
            {{ player.currentContract.wage | formatMoney(team.currency) }}
          </td>
        </tr>
      </tbody>
    </v-simple-table>
  </v-card>
</template>

<script>
  import { TeamAccessible } from '@/mixins'

  export default {
    name: 'ContractListCard',
    mixins: [
      TeamAccessible
    ],
    props: {
      players: { type: Array, required: true },
      title: { type: String, required: true },
      color: { type: String, required: true }
    }
  }
</script>

<style scoped>
  tbody > tr {
    cursor: pointer;
  }
</style>
