<template>
  <v-app>
    <no-ssr v-if="authenticated">
      <app-bar />

      <app-drawer />
    </no-ssr>

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
  import { Vue, Component, Watch } from 'vue-property-decorator'
  import { mapGetters } from 'vuex'
  import { Team } from '@/models'
  import AppBar from '@/components/App/Bar'
  import AppBroadcaster from '@/components/App/Broadcaster'
  import TeamChannel from '@/components/Team/Channel'
  import AppDrawer from '@/components/App/Drawer'

  @Component({
    name: 'App',
    components: {
      AppBar,
      AppBroadcaster,
      TeamChannel,
      AppDrawer
    },
    computed: mapGetters([
      'authenticated'
    ])
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
