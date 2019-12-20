<template lang="pug">
  v-row
    v-col(
      v-for="squad in squads"
      :key="squad.id"
      cols="12"
      md="6"
    )
      squad-card(:squad="squad")
</template>

<script>
  import { mixins, Component } from 'nuxt-property-decorator'
  import { Squad } from '@/models'
  import SquadCard from './Card'
  import { TeamAccessible } from '@/mixins'

  @Component({
    components: {
      SquadCard
    }
  })
  export default class SquadGrid extends mixins(TeamAccessible) {
    get squads () {
      return Squad
        .query()
        .with('squad_players')
        .where('team_id', this.team.id)
        .get()
    }
  }
</script>
