<template>
  <v-data-iterator
    :items="rows"
    :items-per-page="-1"
    no-data-text="No Squads Recorded"
    hide-default-footer
  >
    <template #default="{ items }">
      <v-layout
        row
        wrap
      >
        <v-flex
          v-for="squad in items"
          :key="squad.id"
          xs12
          md6
        >
          <squad-item :squad="squad" />
        </v-flex>
      </v-layout>
    </template>
  </v-data-iterator>
</template>

<script>
  import { Squad } from '@/models'
  import SquadItem from './SquadItem'
  import { TeamAccessible } from '@/mixins'

  export default {
    components: {
      SquadItem
    },
    mixins: [
      TeamAccessible
    ],
    computed: {
      rows () {
        return Squad
          .query()
          .where('team_id', this.team.id)
          .get()
      }
    }
  }
</script>
