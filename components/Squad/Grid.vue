<template>
  <v-data-iterator
    :items="rows"
    :items-per-page="-1"
    no-data-text="No Squads Recorded"
    hide-default-footer
  >
    <template #default="{ items }">
      <v-row>
        <v-col
          v-for="squad in items"
          :key="squad.id"
          cols="12"
          md="6"
        >
          <squad-card :squad="squad" />
        </v-col>
      </v-row>
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
