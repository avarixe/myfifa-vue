<template>
  <v-app>
    <app-bar v-if="$store.getters.authenticated"/>

    <v-content>
      <app-broadcaster />

      <nuxt />
    </v-content>
  </v-app>
</template>

<script>
  import AppBar from '@/components/App/AppBar'
  import AppBroadcaster from '@/components/App/AppBroadcaster'

  export default {
    name: 'App',
    components: {
      AppBar,
      AppBroadcaster
    }
  }
</script>
