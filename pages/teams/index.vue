<template>
  <v-container>
    <v-row>
      <v-col>
        <team-grid />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { mapMutations, mapActions } from 'vuex'
  import TeamGrid from '@/components/Team/Grid'

  export default {
    name: 'TeamsPage',
    middleware: [
      'authenticated'
    ],
    components: {
      TeamGrid
    },
    transition: 'fade-transition',
    async fetch () {
      this.setPage({
        headline: 'Teams'
      })
      await this.fetchTeams()
    },
    methods: {
      ...mapMutations('app', {
        setPage: 'SET_PAGE'
      }),
      ...mapActions('teams', {
        fetchTeams: 'FETCH'
      })
    }
  }
</script>
