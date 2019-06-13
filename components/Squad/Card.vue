<template>
  <v-card outlined>
    <v-card-title>
      <span class="subtitle-1 font-weight-light">{{ squad.name }}</span>

      <v-spacer />

      <squad-actions :squad="squad" />
    </v-card-title>

    <v-divider class="mx-3" />

    <v-card-text>
      <formation-view :formation="squadPlayers" />
    </v-card-text>
  </v-card>
</template>

<script>
  import { FormationView } from '@/helpers'
  import SquadActions from './Actions'

  export default {
    components: {
      SquadActions,
      FormationView
    },
    props: {
      squad: {
        type: Object,
        required: true
      }
    },
    computed: {
      squadPlayers () {
        return this.squad.positions_list.map((pos, i) => ({
          pos: pos,
          player_id: this.squad.players_list[i]
        }))
      }
    }
  }
</script>
