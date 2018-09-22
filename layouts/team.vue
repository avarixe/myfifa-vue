<template>
  <v-app>
    <app-bar></app-bar>
    <v-content>
      <app-broadcaster></app-broadcaster>
      <div class="pt-5">
        <team-socket-listener></team-socket-listener>
        <team-toolbar
          v-if="team"
          :team="team"
        ></team-toolbar>
        <nuxt />
      </div>
    </v-content>
  </v-app>
</template>

<script>
  import { mapGetters } from 'vuex'
  import AppBar from '@/components/AppBar'
  import AppBroadcaster from '@/components/AppBroadcaster'
  import TeamToolbar from '@/components/Team/TeamToolbar'
  import TeamSocketListener from '@/components/Team/TeamSocketListener'

  export default {
    name: 'App',
    components: {
      AppBar,
      AppBroadcaster,
      TeamToolbar,
      TeamSocketListener
    },
    computed: mapGetters({
      team: 'team/current'
    })
  }
</script>
