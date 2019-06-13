<template>
  <v-app>
    <no-ssr>
      <app-bar />

      <team-drawer />
    </no-ssr>

    <v-content>
      <app-broadcaster />

      <template
        v-if="loaded"
      >
        <team-channel />

        <nuxt />

      </template>

      <template
        v-else
      >
        <team-loader
          :team="team"
          @loaded="loaded = true"
        />
      </template>
    </v-content>

    <!-- <team-bottom-navigation /> -->

  </v-app>
</template>

<script>
  import { mapState } from 'vuex'
  import { Team } from '@/models'
  import AppBar from '@/components/App/Bar'
  import AppBroadcaster from '@/components/App/Broadcaster'
  import TeamChannel from '@/components/Team/Channel'
  import TeamLoader from '@/components/Team/Loader'
  import TeamDrawer from '@/components/Team/Drawer'
  // import TeamBottomNavigation from '@/components/Team/TeamBottomNavigation'

  export default {
    name: 'App',
    components: {
      AppBar,
      AppBroadcaster,
      TeamChannel,
      TeamLoader,
      TeamDrawer
      // TeamBottomNavigation
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
