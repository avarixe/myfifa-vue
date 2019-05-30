<template>
  <v-data-iterator
    :items="rows"
    :items-per-page="-1"
    no-data-text="No Seasons Recorded"
    hide-default-footer
  >
    <template #default="{ items }">
      <v-layout
        row
        wrap
      >
        <v-flex
          v-for="season in items"
          :key="season"
          xs12
          sm6
          md4
          lg3
        >
          <season-item
            :season="parseInt(season)"
            compact
          />
        </v-flex>
      </v-layout>
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
