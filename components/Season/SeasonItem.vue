<template>
  <v-card>
    <v-card-title class="title">
      {{ seasonLabel(season) }}
    </v-card-title>
    <v-card-text>
      <v-list>
        <v-list-tile
          v-for="(competition, i) in competitions"
          :key="i">
          <v-list-tile-content>{{ competition.name }}</v-list-tile-content>
          <v-list-tile-action>
            <competition-form :initial-competition="competition">
              <v-tooltip bottom color="orange">
                <v-btn slot="activator" flat icon>
                  <v-icon color="orange">mdi-pencil</v-icon>
                </v-btn>
                Edit
              </v-tooltip>
            </competition-form>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script>
  import { addYears } from 'date-fns'
  import TeamAccessible from '@/mixins/TeamAccessible'
  import CompetitionForm from '@/components/Competition/CompetitionForm'

  export default {
    mixins: [ TeamAccessible ],
    components: {
      CompetitionForm
    },
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
  #app .v-card {
    background-color: rgba(255, 255, 255, 0.5);
  }
</style>
