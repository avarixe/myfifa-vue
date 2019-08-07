<template>
  <v-app>
    <no-ssr>
      <app-bar v-if="$store.getters.authenticated" />

      <team-drawer v-if="teamPage" />
    </no-ssr>

    <app-broadcaster />

    <v-content>
      <app-banner />

      <template v-if="teamPage">
        <team-channel />
        <nuxt />
      </template>
      <template v-else>
        <nuxt />
      </template>
    </v-content>
  </v-app>
</template>

<script>
  import { Vue, Component, Watch } from 'vue-property-decorator'
  import { Team } from '@/models'
  import AppBar from '@/components/App/Bar'
  import AppBanner from '@/components/App/Banner'
  import AppBroadcaster from '@/components/App/Broadcaster'
  import TeamChannel from '@/components/Team/Channel'
  import TeamDrawer from '@/components/Team/Drawer'
  // import AppDrawer from '@/components/App/Drawer'

  @Component({
    name: 'App',
    components: {
      AppBar,
      AppBanner,
      AppBroadcaster,
      TeamChannel,
      TeamDrawer
      // AppDrawer
    }
  })
  export default class Layout extends Vue {
    head () {
      return {
        title: this.$store.state.app.title
      }
    }

    get teamPage () {
      return 'teamId' in this.$route.params
    }

    get team () {
      return Team.find(this.$route.params.teamId)
    }
  }
</script>
