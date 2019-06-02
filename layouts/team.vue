<template>
  <v-app>
    <app-bar />

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

    <team-bottom-navigation />

  </v-app>
</template>

<script>
  import { mapState } from 'vuex'
  import { Team } from '@/models'
  import AppBar from '@/components/App/AppBar'
  import AppBroadcaster from '@/components/App/AppBroadcaster'
  import TeamChannel from '@/components/Team/TeamChannel'
  import TeamLoader from '@/components/Team/TeamLoader'
  import TeamBottomNavigation from '@/components/Team/TeamBottomNavigation'

  export default {
    name: 'App',
    components: {
      AppBar,
      AppBroadcaster,
      TeamChannel,
      TeamLoader,
      TeamBottomNavigation
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
