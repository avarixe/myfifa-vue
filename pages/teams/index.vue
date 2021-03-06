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

  export default {
    name: 'TeamsPage',
    middleware: [
      'authenticated'
    ],
    transition: 'fade-transition',
    async fetch () {
      this.setPage({
        headline: 'Teams'
      })
      await this.fetchTeams()
    },
    methods: {
      ...mapMutations('app', {
        setPage: 'setPage'
      }),
      ...mapActions('teams', {
        fetchTeams: 'fetch'
      })
    }
  }
</script>
