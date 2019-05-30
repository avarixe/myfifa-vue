<template>
  <v-container
    fluid
    grid-list-lg
  >
    <v-layout
      row
      wrap
    >
      <v-flex xs12>
        <div class="overline">{{ team.title }}</div>
        <div class="headline font-weight-thin">Matches</div>
      </v-flex>

      <v-flex xs12>
        <match-form />
      </v-flex>

      <v-flex xs12>
        <match-grid />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import { TeamAccessible } from '@/mixins'
  import MatchForm from '@/components/Match/MatchForm'
  import MatchGrid from '@/components/Match/MatchGrid'

  export default {
    layout: 'team',
    middleware: 'authenticated',
    mixins: [
      TeamAccessible
    ],
    components: {
      MatchForm,
      MatchGrid
    },
    head () {
      return {
        title: `${this.team.title} - Matches`
      }
    },
    mounted () {
      this.$store.commit('app/SET_TITLE', this.team.title)
    }
  }
</script>
