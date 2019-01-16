<template>
  <v-container grid-list-lg>
    <v-layout row wrap>
      <v-flex xs12>
        <team-panel></team-panel>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import TeamPanel from '@/components/Team/TeamPanel'

  export default {
    layout: 'default',
    middleware: 'home',
    components: {
      TeamPanel
    },
    mounted () {
      this.$store.commit('app/SET_TITLE', 'Teams')
    }
  }
</script>
