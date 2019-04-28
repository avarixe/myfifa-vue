<template>
  <v-data-iterator
    :items="rows"
    no-data-text="No Squads Recorded"
    hide-actions
    content-tag="v-layout"
    row
    wrap
  >
    <template #item="{ item }">
      <v-flex
        xs12
        md6
      >
        <squad-item :squad="item" />
      </v-flex>
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
