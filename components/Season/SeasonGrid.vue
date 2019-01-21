<template>
  <v-data-iterator
    :items="rows"
    :pagination-sync="pagination"
    no-data-text="No Seasons Recorded"
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
        sm6
        md4
        lg3
      >
        <season-item
          :season="parseInt(props.item[0])"
          :competitions="props.item[1]"
        />
      </v-flex>
    </template>
  </v-data-iterator>
</template>

<script>
  import { Competition } from '@/models'
  import TeamAccessible from '@/mixins/TeamAccessible'
  import SeasonItem from './SeasonItem'

  export default {
    mixins: [ TeamAccessible ],
    components: {
      SeasonItem
    },
    data: () => ({
      pagination: {
        rowsPerPage: -1
      }
    }),
    computed: {
      competitions () {
        return Competition
          .query()
          .where('team_id', this.team.id)
          .get()
      },
      rows () {
        return this.$_orderBy(
          Object.entries(this.$_groupBy(
            this.competitions,
            competition => competition.season
          )),
          season => season[0],
          'desc'
        )
      }
    }
  }
</script>
