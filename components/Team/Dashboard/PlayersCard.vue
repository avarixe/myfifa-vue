<template>
  <material-card
    :color="color"
    :title="title"
  >
    <v-data-table
      :headers="headers"
      :items="players"
      item-key="id"
      disable-initial-sort
      hide-actions
      hide-headers
      no-data-text="No Players Found"
    >
      <template #items="{ item: player }">
        <td>{{ player.name }}</td>
        <td class="text-xs-right">
          <v-btn
            :to="playerLink(player)"
            :color="color"
            nuxt
            dark
            small
            outline
            class="my-0"
          >View</v-btn>
        </td>
      </template>
    </v-data-table>
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
    data: () => ({
      headers: [
        {
          text: 'Player',
          value: 'name'
        },
        {
          text: '',
          value: null,
          sortable: false
        }
      ]
    }),
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
