<template>
  <v-app>
    <app-bar></app-bar>
    <v-content>
      <app-broadcaster></app-broadcaster>
      <app-drawer></app-drawer>
      <template v-if="loaded">
        <team-channel></team-channel>
        <nuxt />
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
  import { mapState } from 'vuex'
  import { Team } from '@/models'
  import AppBar from '@/components/App/AppBar'
  import AppBroadcaster from '@/components/App/AppBroadcaster'
  import AppDrawer from '@/components/App/AppDrawer'
  // import TeamBar from '@/components/Team/TeamBar'
  import TeamChannel from '@/components/Team/TeamChannel'
  import TeamLoader from '@/components/Team/TeamLoader'

  export default {
    name: 'App',
    // middleware: 'responsive',
    components: {
      AppBar,
      AppBroadcaster,
      AppDrawer,
      // TeamBar,
      TeamChannel,
      TeamLoader
    },
    data: () => ({
      loaded: false
    }),
    computed: {
      ...mapState('app', [
        'drawer'
      ]),
      team () {
        return Team.find(this.$route.params.teamId)
      }
    }
  }
</script>
