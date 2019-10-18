<template>
  <v-app>
    <client-only v-if="authenticated">
      <app-bar />

      <app-drawer />
    </client-only>

    <app-broadcaster />

    <v-content>
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
  import { Vue, Component, Getter, namespace } from 'nuxt-property-decorator'
  import { Team } from '@/models'
  import AppBar from '@/components/App/Bar'
  import AppBroadcaster from '@/components/App/Broadcaster'
  import TeamChannel from '@/components/Team/Channel'
  import AppDrawer from '@/components/App/Drawer'

  const app = namespace('app')

  @Component({
    components: {
      AppBar,
      AppBroadcaster,
      TeamChannel,
      AppDrawer
    }
  })
  export default class Layout extends Vue {
    @Getter authenticated
    @app.State title

    head () {
      return {
        title: this.title
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
