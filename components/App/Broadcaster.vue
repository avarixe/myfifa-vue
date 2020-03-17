<template>
  <v-snackbar
    v-model="snackbar"
    :color="color"
    bottom
  >
    {{ message }}
    <v-btn
      dark
      text
      @click="snackbar = false"
    >
      Close
    </v-btn>
  </v-snackbar>
</template>

<script>
  import { mapState, mapMutations } from 'vuex'

  export default {
    name: 'AppBroadcaster',
    data: () => ({
      snackbar: false
    }),
    computed: mapState('broadcaster', [
      'message',
      'color'
    ]),
    watch: {
      message (val) {
        this.snackbar = val.length > 0
      },
      snackbar (val) {
        !val && this.clearBroadcast()
      }
    },
    methods: mapMutations('broadcaster', {
      clearBroadcast: 'CLEAR'
    })
  }
</script>
