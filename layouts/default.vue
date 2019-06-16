<template>
  <v-app>
    <no-ssr>
      <app-bar v-if="$store.getters.authenticated" />

      <team-drawer v-if="teamPage && loaded" />
    </no-ssr>

    <app-broadcaster />

    <v-content>
      <template v-if="teamPage">
        <template v-if="loaded">
          <team-channel />
          <nuxt />
        </template>
        <team-loader
          v-else
          :team="team"
          @loaded="loaded = true"
        />
      </template>
      <template v-else>
        <nuxt />
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
      teamPage () {
        return 'teamId' in this.$route.params
      },
      team () {
        return Team.find(this.$route.params.teamId)
      }
    }
  }
</script>
