<template>
  <v-container fluid grid-list-lg>
    <v-layout row wrap>
      <v-flex xs12>
        <player-form>
          <v-btn>
            <v-icon left>mdi-plus-circle-outline</v-icon>
            Player
          </v-btn>
        </player-form>
      </v-flex>
      <v-flex xs12>
        <player-grid></player-grid>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import PlayerForm from '@/components/Player/PlayerForm'
  import PlayerGrid from '@/components/Player/PlayerGrid'

  export default {
    layout: 'team',
    components: {
      PlayerForm,
      PlayerGrid
    },
    head () {
      return {
        title: `${this.$store.getters['entities/teams/current'].title} - Players`
      }
    },
    async fetch ({ store, params }) {
      await store.dispatch('entities/teams/GET', {
        teamId: params.id,
        activate: true
      })
    }
  }
</script>
