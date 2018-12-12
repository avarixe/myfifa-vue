<template>
  <v-app>
    <app-bar></app-bar>
    <v-content>
      <app-broadcaster></app-broadcaster>
      <div class="pt-5">
        <team-channel></team-channel>
        <team-bar v-if="team" :team="team"></team-bar>
        <nuxt />
      </div>
    </v-content>
  </v-app>
</template>

<script>
  import { mapGetters } from 'vuex'
  import AppBar from '@/components/App/AppBar'
  import AppBroadcaster from '@/components/App/AppBroadcaster'
  import TeamBar from '@/components/Team/TeamBar'
  import TeamChannel from '@/components/Team/TeamChannel'

  export default {
    name: 'App',
    components: {
      AppBar,
      AppBroadcaster,
      TeamBar,
      TeamChannel
    },
    computed: mapGetters({
      team: 'entities/teams/current'
    })
  }
</script>
