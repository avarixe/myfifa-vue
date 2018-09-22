<template>
  <v-container fluid grid-list-lg>
    <v-layout row wrap>
      <v-flex xs12>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    layout: 'team',
    middleware: 'authenticated',
    async fetch ({ store, params }) {
      await store.dispatch('team/get', {
        teamId: params.id,
        activate: true
      })
    }
  }
</script>
