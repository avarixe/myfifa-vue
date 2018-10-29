<template>
  <v-container fluid grid-list-lg>
    <v-layout row wrap>
      <v-flex xs12>
        <squad-form>
          <v-btn>
            <v-icon left>mdi-plus-circle-outline</v-icon>
            Squad
          </v-btn>
        </squad-form>
      </v-flex>
      <v-flex xs12>
        <squad-grid></squad-grid>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import SquadForm from '@/components/Squad/SquadForm'
  import SquadGrid from '@/components/Squad/SquadGrid'

  export default {
    layout: 'team',
    middleware: 'authenticated',
    async fetch ({ store, params }) {
      if (!store.state.team.currentId) {
        await store.dispatch('team/get', { teamId: params.id, activate: true })
      }
    },
    components: {
      SquadForm,
      SquadGrid
    }
  }
</script>
