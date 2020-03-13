<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <season-timeline />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { mapMutations } from 'vuex'
  import { TeamAccessible } from '@/mixins'
  import SeasonTimeline from '@/components/Season/Timeline'

  export default {
    name: 'SeasonsPage',
    components: {
      SeasonTimeline
    },
    mixins: [
      TeamAccessible
    ],
    middleware: [
      'authenticated'
    ],
    transition: 'fade-transition',
    async fetch ({ store, params }) {
      await store.dispatch('competitions/FETCH', { teamId: params.teamId })
    },
    mounted () {
      this.setPage({
        title: `${this.team.title} - Seasons`,
        overline: this.team.title,
        headline: 'Seasons'
      })
    },
    methods: mapMutations('app', {
      setPage: 'SET_PAGE'
    })
  }
</script>
