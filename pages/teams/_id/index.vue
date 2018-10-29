<template>
  <v-container fluid grid-list-lg>
    <v-layout row wrap>
      <v-flex xs12>
        <competition-form>
          <v-btn>
            <v-icon left>mdi-plus-circle-outline</v-icon>
            Competition
          </v-btn>
        </competition-form>
      </v-flex>
      <v-flex xs12>
        <season-grid></season-grid>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import SeasonGrid from '@/components/Season/SeasonGrid'
  import CompetitionForm from '@/components/Competition/CompetitionForm'

  export default {
    layout: 'team',
    middleware: 'authenticated',
    async fetch ({ store, params }) {
      if (!store.state.team.currentId) {
        await store.dispatch('team/get', { teamId: params.id, activate: true })
      }
    },
    components: {
      CompetitionForm,
      SeasonGrid
    }
  }
</script>
