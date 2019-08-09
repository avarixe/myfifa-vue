<template>
  <div>
    <v-timeline dense>
      <v-timeline-item
        v-for="season in seasons"
        :key="season"
        :icon="`mdi-numeric-${season + 1}`"
        fill-dot
      >
        <season-card :season="parseInt(season)" />
      </v-timeline-item>
    </v-timeline>
  </div>
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

    get seasons () {
      return [...Array(this.numSeasons).keys()].reverse()
    }
  }
</script>
