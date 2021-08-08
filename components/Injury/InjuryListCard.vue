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
          <th>Injury</th>
          <th class="text-right">Recovers On</th>
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
          <td>{{ player.currentInjury.description }}</td>
          <td class="text-right">
            {{ player.currentInjury.endedOn | formatDate }}
          </td>
        </tr>
      </tbody>
    </v-simple-table>
  </v-card>
</template>

<script>
  import { formatDistance, parseISO } from 'date-fns'
  import { TeamAccessible } from '@/mixins'

  export default {
    name: 'InjuryListCard',
    mixins: [
      TeamAccessible
    ],
    props: {
      players: { type: Array, required: true },
      title: { type: String, required: true },
      color: { type: String, required: true }
    },
    methods: {
      injuryDuration (player) {
        return formatDistance(
          parseISO(player.currentInjury.endedOn),
          parseISO(player.currentInjury.startedOn)
        )
      }
    }
  }
</script>

<style scoped>
  tbody > tr {
    cursor: pointer;
  }
</style>
