<template>
  <v-app>
    <no-ssr>
      <app-bar />

      <app-drawer
        v-if="$store.getters.authenticated"
      />
    </no-ssr>

    <v-content>
      <app-broadcaster />

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
