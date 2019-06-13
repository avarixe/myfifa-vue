<template>
  <v-app>
    <no-ssr>
      <app-bar v-if="$store.getters.authenticated"/>
    </no-ssr>

    <v-content>
      <app-broadcaster />

      <nuxt />
    </v-content>
  </v-app>
</template>

<script>
  import AppBar from '@/components/App/Bar'
  import AppBroadcaster from '@/components/App/Broadcaster'

  export default {
    name: 'App',
    components: {
      AppBar,
      AppBroadcaster
    }
  }
</script>
