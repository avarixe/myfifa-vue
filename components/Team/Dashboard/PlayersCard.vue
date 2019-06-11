<template>
  <v-card outlined>
    <v-card-title
      :class="`title font-weight-light ${color}--text`"
    >{{ title }}</v-card-title>

    <v-divider class="mx-3" />

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
  </v-card>
</template>

<script>
  export default {
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
