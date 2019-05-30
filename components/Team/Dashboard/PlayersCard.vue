<template>
  <material-card
    :color="color"
    :title="title"
  >
    <v-simple-table>
      <thead>
        <th>Player</th>
        <th></th>
      </thead>
      <tbody>
        <tr
          v-for="player in players"
          :key="player.id"
        >
          <td>{{ player.name }}</td>
          <td class="text-xs-right">
            <v-btn
              :to="playerLink(player)"
              :color="color"
              nuxt
              dark
              small
              outlined
              class="my-0"
            >View</v-btn>
          </td>
        </tr>
      </tbody>
    </v-simple-table>
  </material-card>
</template>

<script>
  import MaterialCard from '@/components/theme/Card'

  export default {
    components: {
      MaterialCard
    },
    props: {
      players: {
        type: Array,
        default: []
      },
      color: {
        type: String,
        default: 'primary'
      },
      title: String
    },
    methods: {
      playerLink (player) {
        return {
          name: 'teams-teamId-players-playerId',
          params: {
            teamId: player.team_id,
            playerId: player.id
          }
        }
      }
    }
  }
</script>
