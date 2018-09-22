<template>
  <v-container fluid grid-list-lg>
    <v-layout row wrap>
      <v-flex xs12>
        <v-card>
          <v-card-title primary-title>
            <div class="display-2">{{ team.title }}</div>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import TeamAccessible from '@/mixins/TeamAccessible'

  export default {
    layout: 'team',
    middleware: 'authenticated',
    async fetch ({ store, params }) {
      await store.dispatch('team/get', {
        teamId: params.id,
        activate: true
      })
    },
    mixins: [ TeamAccessible ]
  }
</script>
