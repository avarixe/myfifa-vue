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
  import AppBar from '@/components/AppBar'
  import AppBroadcaster from '@/components/AppBroadcaster'

  export default {
    name: 'App',
    components: {
      AppBar,
      AppBroadcaster
    },
    mounted () {
      this.$store.commit('team/CLEAR')
    }
  }
</script>
