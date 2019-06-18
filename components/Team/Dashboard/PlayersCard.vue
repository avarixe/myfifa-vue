<template>
  <v-card outlined>
    <v-card-title :class="`subtitle-1 d-block text-xs-center`">
      <span :class="`${color}--text font-weight-light`">{{ title }}</span>
    </v-card-title>

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
  import { Vue, Component, Prop } from 'nuxt-property-decorator'

  @Component
  export default class PlayersCard extends Vue {
    @Prop({ type: Array, default: [] }) players
    @Prop({ type: String, default: 'primary' }) color
    @Prop(String) title

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
</script>
