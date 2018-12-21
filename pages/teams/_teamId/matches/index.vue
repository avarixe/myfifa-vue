<template>
  <v-container fluid grid-list-lg>
    <v-layout row wrap>
      <v-flex xs12>
        <match-form>
          <v-btn>
            <v-icon left>mdi-plus-circle-outline</v-icon>
            Match
          </v-btn>
        </match-form>
      </v-flex>
      <v-flex xs12>
        <match-grid></match-grid>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import TeamAccessible from '@/mixins/TeamAccessible'
  import MatchForm from '@/components/Match/MatchForm'
  import MatchGrid from '@/components/Match/MatchGrid'

  export default {
    layout: 'team',
    middleware: 'authenticated',
    mixins: [ TeamAccessible ],
    head () {
      return {
        title: `${this.team.title} - Matches`
      }
    },
    components: {
      MatchForm,
      MatchGrid
    }
  }
</script>
