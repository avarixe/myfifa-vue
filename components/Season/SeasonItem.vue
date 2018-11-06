<template>
  <v-card>
    <v-card-title class="headline">
      {{ seasonLabel(season) }}
      <v-tooltip color="primary" bottom>
        <v-btn
          slot="activator"
          :to="seasonLink"
          nuxt
          small
          icon>
          <v-icon color="primary">mdi-arrow-right</v-icon>
        </v-btn>
        View Season
      </v-tooltip>
    </v-card-title>
    <v-card-text>
      <v-list dense>
        <v-subheader>Competitions</v-subheader>
        <v-list-tile
          v-for="(competition, i) in competitions"
          :key="i"
          :to="competitionLink(competition)"
          class="elevation-1">
          <v-list-tile-title>
            <v-icon color="blue" small left>mdi-arrow-right</v-icon>
            {{ competition.name }}
          </v-list-tile-title>
          <v-list-tile-avatar v-if="competition.champion === team.title">
            <v-icon color="yellow darken-2">mdi-trophy</v-icon>
          </v-list-tile-avatar>
        </v-list-tile>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script>
  import { addYears } from 'date-fns'
  import TeamAccessible from '@/mixins/TeamAccessible'

  export default {
    mixins: [ TeamAccessible ],
    props: {
      season: {
        type: Number,
        required: true
      },
      competitions: {
        type: Array,
        required: true
      }
    },
    computed: {
      seasonLink () {
        return {
          name: 'teams-id-seasons-seasonId',
          params: {
            id: this.team.id,
            seasonId: this.season
          }
        }
      }
    },
    methods: {
      competitionLink (competition) {
        return {
          name: 'teams-id-competitions-competitionId',
          params: {
            id: this.team.id,
            competitionId: competition.id }
          }
      }
    }
  }
</script>

<style scoped>
  #app .v-card,
  #app .v-list {
    background-color: rgba(255, 255, 255, 0.5);
  }
</style>
