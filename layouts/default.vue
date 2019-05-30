<template>
  <v-app>
    <no-ssr>
      <app-bar />
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

  export default {
    name: 'App',
    // middleware: ['responsive'],
    components: {
      AppBar,
      AppBroadcaster
    }
  }
</script>
