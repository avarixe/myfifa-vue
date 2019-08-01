<template>
  <v-app>
    <no-ssr>
      <app-bar v-if="$store.getters.authenticated" />

      <team-drawer v-if="teamPage" />
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
  import { mapState } from 'vuex'
  import { Team } from '@/models'
  import AppBar from '@/components/App/Bar'
  import AppBroadcaster from '@/components/App/Broadcaster'
  import TeamChannel from '@/components/Team/Channel'
  import TeamDrawer from '@/components/Team/Drawer'

  @Component({
    name: 'App',
    components: {
      AppBar,
      AppBroadcaster,
      TeamChannel,
      TeamDrawer
    },
    computed: mapState('app', ['drawer'])
  })
  export default class Layout extends Vue {
    get teamPage () {
      return 'teamId' in this.$route.params
    }

    get team () {
      return Team.find(this.$route.params.teamId)
    }
  }
</script>
