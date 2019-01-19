<template>
  <v-app>
    <app-bar></app-bar>
    <v-content>
      <app-broadcaster></app-broadcaster>
      <app-drawer
        v-if="$store.getters.authenticated"
      ></app-drawer>
      <nuxt />
    </v-content>
  </v-app>
</template>

<script>
  import AppBar from '@/components/App/AppBar'
  import AppBroadcaster from '@/components/App/AppBroadcaster'
  import AppDrawer from '@/components/App/AppDrawer'

  export default {
    name: 'App',
    // middleware: ['responsive'],
    components: {
      AppBar,
      AppBroadcaster,
      AppDrawer
    }
  }
</script>
