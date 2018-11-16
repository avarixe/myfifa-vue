<template>
  <v-card>
    <v-card-title class="title">
      {{ squad.name }}

      <squad-form :initial-squad="squad">
        <v-tooltip bottom color="orange">
          <v-btn slot="activator" flat icon>
            <v-icon color="orange">mdi-pencil</v-icon>
          </v-btn>
          Edit
        </v-tooltip>
      </squad-form>
    </v-card-title>
    <formation-view
      :formation="squadPlayers"
    ></formation-view>
  </v-card>
</template>

<script>
  import SquadForm from '@/components/Squad/SquadForm'
  import FormationView from '@/components/FormationView'

  export default {
    components: {
      SquadForm,
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
