<template>
  <v-container>
    <v-row>
      <v-col>
        <match-grid />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { mapMutations, mapActions } from 'vuex'
  import { TeamAccessible } from '@/mixins'

  export default {
    name: 'MatchesPage',
    mixins: [
      TeamAccessible
    ],
    middleware: [
      'authenticated'
    ],
    transition: 'fade-transition',
    async fetch () {
      await Promise.all([
        this.fetchMatches({ teamId: this.team.id }),
        this.fetchCompetitions({ teamId: this.team.id })
      ])
      this.setPage({
        title: `${this.team.name} - Matches`,
        headline: 'Matches'
      })
    },
    methods: {
      ...mapMutations('app', {
        setPage: 'setPage'
      }),
      ...mapActions({
        fetchMatches: 'matches/fetch',
        fetchCompetitions: 'competitions/fetch'
      })
    }
  }
</script>
