<template>
  <v-app>
    <app-bar></app-bar>
    <v-content>
      <app-broadcaster></app-broadcaster>
      <div class="pt-5">
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
  import TeamToolbar from '@/components/Team/TeamToolbar'
  import AppBroadcaster from '@/components/AppBroadcaster'

  export default {
    name: 'App',
    components: {
      AppBar,
      TeamToolbar,
      AppBroadcaster
    },
    computed: mapGetters({
      team: 'team/current'
    })
  }
</script>
