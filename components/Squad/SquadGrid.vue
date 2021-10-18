<script>
  import { computed, useStore } from '@nuxtjs/composition-api'
  import { useTeam } from '@/composables'

  export default {
    name: 'SquadGrid',
    setup () {
      const store = useStore()
      const { teamId } = useTeam()
      const squads = computed(() =>
        store.$db().model('Squad')
          .query()
          .with('squadPlayers')
          .where('teamId', parseInt(teamId.value))
          .get()
      )

      return { squads }
    }
  }
</script>

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
