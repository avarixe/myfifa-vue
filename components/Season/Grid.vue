<template>
  <v-data-iterator
    :items="rows"
    :items-per-page="-1"
    no-data-text="No Seasons Recorded"
    hide-default-footer
  >
    <template #default="{ items }">
      <v-row>
        <v-col
          v-for="season in items"
          :key="season"
          cols="12"
          md="6"
          lg="4"
          xl="3"
        >
          <season-card
            :season="parseInt(season)"
            compact
          />
        </v-col>
      </v-row>
    </template>
  </v-data-iterator>
</template>

<script>
  import { mixins, Component } from 'nuxt-property-decorator'
  import { TeamAccessible } from '@/mixins'
  import SeasonCard from './Card'

  @Component({
    components: {
      SeasonCard
    }
  })
  export default class SeasonGrid extends mixins(TeamAccessible) {
    get numSeasons () {
      return this.season > 0 ? this.season + 1 : 1
    }

    get rows () {
      return [...Array(this.numSeasons).keys()].reverse()
    }
  }
</script>
