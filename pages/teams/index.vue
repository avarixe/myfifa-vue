<template>
  <v-container grid-list-lg>
    <v-layout
      row
      wrap
    >
      <v-flex xs12>
        <team-grid />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import TeamGrid from '@/components/Team/TeamGrid'

  export default {
    layout: 'default',
    middleware: 'home',
    components: {
      TeamGrid
    },
    mounted () {
      this.$store.commit('app/SET_TITLE', 'Teams')
    }
  }
</script>
