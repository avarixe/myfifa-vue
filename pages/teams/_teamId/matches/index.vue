<template>
  <v-container fluid>
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
  import MatchGrid from '@/components/Match/Grid'

  export default {
    name: 'MatchesPage',
    components: {
      MatchGrid
    },
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
        title: `${this.team.title} - Matches`,
        overline: this.team.title,
        headline: 'Matches'
      })
    },
    methods: {
      ...mapMutations('app', {
        setPage: 'SET_PAGE'
      }),
      ...mapActions({
        fetchMatches: 'matches/FETCH',
        fetchCompetitions: 'competitions/FETCH'
      })
    }
  }
</script>
