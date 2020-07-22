<template>
  <v-row>
    <v-col
      v-for="squad in squads"
      :key="squad.id"
      cols="12"
      md="6"
    >
      <squad-card :squad="squad" />
    </v-col>
  </v-row>
</template>

<script>
  import { Squad } from '@/models'
  import { TeamAccessible } from '@/mixins'

  export default {
    name: 'SquadGrid',
    mixins: [
      TeamAccessible
    ],
    computed: {
      squads () {
        return Squad
          .query()
          .with('squad_players')
          .where('team_id', this.team.id)
          .get()
      }
    }
  }
</script>
