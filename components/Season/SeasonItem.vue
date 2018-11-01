<template>
  <v-card>
    <v-card-title class="title">
      {{ seasonLabel(season) }}
    </v-card-title>
    <v-card-text>
      <v-list dense>
        <v-subheader>Competitions</v-subheader>
        <v-list-tile
          v-for="(competition, i) in competitions"
          :key="i"
          :to="{ name: 'competitions-id', params: { id: competition.id } }"
          class="elevation-1">
          <v-list-tile-title>
            <v-icon color="blue" small left>mdi-arrow-right</v-icon>
            {{ competition.name }}
          </v-list-tile-title>
          <v-list-tile-avatar v-if="competition.champion === team.name">
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
    }
  }
</script>

<style scoped>
  #app .v-card,
  #app .v-list {
    background-color: rgba(255, 255, 255, 0.5);
  }
</style>
