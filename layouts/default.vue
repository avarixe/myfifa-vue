<template>
  <v-app>
    <app-bar></app-bar>
    <v-content>
      <app-broadcaster></app-broadcaster>
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
