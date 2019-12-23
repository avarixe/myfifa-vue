<template lang="pug">
  v-timeline(dense)
    v-timeline-item(
      v-for="season in seasons"
      :key="season"
      :icon="`mdi-numeric-${season + 1}`"
      fill-dot
    )
      season-card(:season="parseInt(season)")
</template>

<script>
  import { TeamAccessible } from '@/mixins'
  import SeasonCard from './Card'

  export default {
    name: 'SeasonGrid',
    components: {
      SeasonCard
    },
    mixins: [
      TeamAccessible
    ],
    computed: {
      numSeasons () {
        return this.season > 0 ? this.season + 1 : 1
      },
      seasons () {
        return [...Array(this.numSeasons).keys()].reverse()
      }
    }
  }
</script>
