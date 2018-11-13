<template>
  <v-container fluid grid-list-lg>
    <v-layout row wrap>
      <v-flex xs12>
        <v-card>
          <v-card-title class="text-xs-center">
            <div class="subheading">{{ seasonLabel(season) }}</div>
          </v-card-title>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import TeamAccessible from '@/mixins/TeamAccessible'

  export default {
    layout: 'team',
    middleware: 'authenticated',
    mixins: [ TeamAccessible ],
    computed: {
      season () {
        return this.$route.params.seasonId
      }
    },
    async fetch ({ store, params }) {
      if (store.state.team.currentId !== params.id) {
        await store.dispatch('team/get', { teamId: params.id, activate: true })
      }
    },
    mounted () {
      this.$store.dispatch('team/analyzeSeason', {
        teamId: this.team.id,
        season: this.season
      })
    }
  }
</script>
