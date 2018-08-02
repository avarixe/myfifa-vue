<template>
  <v-snackbar
    v-model="snackbar"
    :color="color"
    bottom>
    {{ message }}
    <v-btn dark flat @click="snackbar = false">
      Close
    </v-btn>
  </v-snackbar>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
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
        !val && this.$store.commit('broadcaster/clear')
      }
    }
  }
</script>