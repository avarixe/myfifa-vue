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
  </v-app>
</template>

<script>
  import { mapState } from 'vuex'
  import { Team } from '@/models'
  import AppBar from '@/components/App/AppBar'
  import AppBroadcaster from '@/components/App/AppBroadcaster'
  import TeamChannel from '@/components/Team/TeamChannel'
  import TeamDrawer from '@/components/Team/TeamDrawer'
  import TeamLoader from '@/components/Team/TeamLoader'

  export default {
    name: 'App',
    components: {
      AppBar,
      AppBroadcaster,
      TeamChannel,
      TeamDrawer,
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
