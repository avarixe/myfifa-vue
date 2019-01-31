<template>
  <v-container
    fluid
    grid-list-lg
  >
    <v-layout
      row
      wrap
    >
      <v-flex
        xs12
      >
        <player-grid />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import {
    TeamAccessible
  } from '@/mixins'
  import PlayerGrid from '@/components/Player/PlayerGrid'

  export default {
    layout: 'team',
    middleware: 'authenticated',
    mixins: [ TeamAccessible ],
    components: {
      PlayerGrid
    },
    head () {
      return {
        title: `${this.team.title} - Players`
      }
    },
    mounted () {
      this.$store.commit('app/SET_TITLE', this.team.title)
    }
  }
</script>
