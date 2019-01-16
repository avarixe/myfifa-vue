<template>
  <v-container fluid grid-list-lg>
    <v-layout row wrap>
      <v-flex xs12>
        <match-grid></match-grid>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import TeamAccessible from '@/mixins/TeamAccessible'
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
      MatchGrid
    },
    mounted () {
      this.$store.commit('app/SET_TITLE', this.team.title)
    }
  }
</script>
