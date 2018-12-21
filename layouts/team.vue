<template>
  <v-app>
    <app-bar></app-bar>
    <v-content>
      <template v-if="loaded">
        <app-broadcaster></app-broadcaster>
        <div class="pt-5">
          <team-channel></team-channel>
          <team-bar v-if="team"></team-bar>
          <nuxt />
        </div>
      </template>
      <template v-else>
        <team-loader
          :team="team"
          @loaded="loaded = true"
        ></team-loader>
      </template>
    </v-content>
  </v-app>
</template>

<script>
  import { Team } from '@/models'
  import AppBar from '@/components/App/AppBar'
  import AppBroadcaster from '@/components/App/AppBroadcaster'
  import TeamBar from '@/components/Team/TeamBar'
  import TeamChannel from '@/components/Team/TeamChannel'
  import TeamLoader from '@/components/Team/TeamLoader'

  export default {
    name: 'App',
    components: {
      AppBar,
      AppBroadcaster,
      TeamBar,
      TeamChannel,
      TeamLoader
    },
    data: () => ({
      loaded: false
    }),
    computed: {
      team () {
        return Team.find(this.$route.params.teamId)
      }
    }
  }
</script>
