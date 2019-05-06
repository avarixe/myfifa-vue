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
    <template #item="{ item }">
      <v-flex
        xs12
        sm6
        md4
        lg3
      >
        <season-item
          :season="parseInt(item)"
          compact
        />
      </v-flex>
    </template>
  </v-data-iterator>
</template>

<script>
  import { TeamAccessible } from '@/mixins'
  import SeasonItem from './SeasonItem'

  export default {
    mixins: [
      TeamAccessible
    ],
    components: {
      SeasonItem
    },
    data: () => ({
      pagination: {
        rowsPerPage: -1
      }
    }),
    computed: {
      numSeasons () {
        return this.season > 0 ? this.season + 1 : 1
      },
      rows () {
        return [...Array(this.numSeasons).keys()].reverse()
      }
    }
  }
</script>
