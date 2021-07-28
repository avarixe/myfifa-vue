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
          <th class="text-right">Duration</th>
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
          <td>{{ player.injuryDescription }}</td>
          <td class="text-right">{{ player.injuryDuration }}</td>
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
      injuries: { type: Array, required: true },
      title: { type: String, required: true },
      color: { type: String, required: true }
    },
    computed: {
      players () {
        return this.injuries.map(injury => {
          const player = this.$store.$db().model('Player').find(injury.playerId)
          return {
            ...player,
            injuryDescription: injury.description,
            injuryDuration: formatDistance(
              parseISO(injury.endedOn || this.team.currentlyOn),
              parseISO(injury.startedOn)
            )
          }
        })
      }
    }
  }
</script>

<style scoped>
  tbody > tr {
    cursor: pointer;
  }
</style>
