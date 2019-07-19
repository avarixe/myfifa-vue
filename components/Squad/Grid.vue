<template>
  <v-data-iterator
    :items="rows"
    :items-per-page="-1"
    no-data-text="No Squads Recorded"
    hide-default-footer
  >
    <template #default="{ items }">
      <v-layout wrap>
        <v-flex
          v-for="squad in items"
          :key="squad.id"
          xs12
          md6
        >
          <squad-card :squad="squad" />
        </v-flex>
      </v-layout>
    </template>
  </v-data-iterator>
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
    get rows () {
      return Squad
        .query()
        .with('squad_players')
        .where('team_id', this.team.id)
        .get()
    }
  }
</script>
