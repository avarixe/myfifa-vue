<template>
  <v-card>
    <v-card-title class="title">
      {{ squad.name }}

      <squad-actions :squad="squad"></squad-actions>
    </v-card-title>
    <formation-view
      :formation="squadPlayers"
    ></formation-view>
  </v-card>
</template>

<script>
  import SquadActions from './SquadActions'
  import FormationView from './FormationView'

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

<style scoped>
  #app .v-card {
    background-color: rgba(255, 255, 255, 0.5);
  }
</style>
