<template>
  <v-data-iterator
    :items="rows"
    :pagination-sync="pagination"
    no-data-text="No Squads Recorded"
    hide-actions
    content-tag="v-layout"
    row
    wrap
  >
    <template
      slot="item"
      slot-scope="props"
    >
      <v-flex
        xs12
        md6
      >
        <squad-item
          :squad="props.item"
        ></squad-item>
      </v-flex>
    </template>
  </v-data-iterator>
</template>

<script>
  import { Squad } from '@/models'
  import SquadItem from './SquadItem'
  import TeamAccessible from '@/mixins/TeamAccessible'

  export default {
    components: {
      SquadItem
    },
    mixins: [ TeamAccessible ],
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
