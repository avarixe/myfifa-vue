<template>
  <v-snackbar
    v-model="snackbar"
    :color="color"
    bottom
    app
  >
    {{ message }}
    <template #action="{ attrs }">
      <v-btn
        dark
        text
        v-bind="attrs"
        @click="snackbar = false"
      >
        Close
      </v-btn>
    </template>
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
      clearBroadcast: 'clear'
    })
  }
</script>
