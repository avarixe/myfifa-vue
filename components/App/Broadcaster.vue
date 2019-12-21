<template lang="pug">
  v-snackbar(v-model="snackbar" :color="color" bottom)
    | {{ message }}
    v-btn(dark text @click="snackbar = false") Close
</template>

<script>
  import { Vue, Component, Watch, namespace } from 'nuxt-property-decorator'

  const broadcaster = namespace('broadcaster')

  @Component
  export default class AppBroadcaster extends Vue {
    @broadcaster.State message
    @broadcaster.State color
    @broadcaster.Mutation('CLEAR') clearBroadcast
    snackbar = false

    @Watch('message')
    toggleSnackbar (val) {
      this.snackbar = val.length > 0
    }

    @Watch('snackbar')
    clear (val) {
      !val && this.clearBroadcast()
    }
  }
</script>
