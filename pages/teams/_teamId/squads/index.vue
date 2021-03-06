<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <squad-grid />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { mapMutations, mapActions } from 'vuex'
  import { TeamAccessible } from '@/mixins'

  export default {
    name: 'SquadsPage',
    mixins: [
      TeamAccessible
    ],
    middleware: [
      'authenticated'
    ],
    transition: 'fade-transition',
    async fetch () {
      await Promise.all([
        this.fetchSquads({ teamId: this.team.id }),
        this.fetchPlayers({ teamId: this.team.id })
      ])
      this.setPage({
        title: `${this.team.title} - Squads`,
        overline: this.team.title,
        headline: 'Squads'
      })
    },
    methods: {
      ...mapMutations('app', {
        setPage: 'setPage'
      }),
      ...mapActions({
        fetchSquads: 'squads/fetch',
        fetchPlayers: 'players/fetch'
      })
    }
  }
</script>
