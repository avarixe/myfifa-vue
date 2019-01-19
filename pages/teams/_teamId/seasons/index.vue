<template>
  <v-container fluid grid-list-lg>
    <v-layout row wrap>
      <v-flex xs12>
        <new-competition-form>
          <v-btn>
            <v-icon left>mdi-plus-circle-outline</v-icon>
            Competition
          </v-btn>
        </new-competition-form>
      </v-flex>
      <v-flex xs12>
        <season-grid></season-grid>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import TeamAccessible from '@/mixins/TeamAccessible'
  import SeasonGrid from '@/components/Season/SeasonGrid'
  import NewCompetitionForm from '@/components/Competition/NewCompetitionForm'

  export default {
    layout: 'team',
    middleware: 'authenticated',
    mixins: [ TeamAccessible ],
    head () {
      return {
        title: `${this.team.title} - Seasons`
      }
    },
    components: {
      NewCompetitionForm,
      SeasonGrid
    },
    mounted () {
      this.$store.commit('app/SET_TITLE', this.team.title)
    }
  }
</script>
