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
    >Close</v-btn>
  </v-snackbar>
</template>

<script>
  import { Vue, Component, Watch } from 'nuxt-property-decorator'
  import { mapState } from 'vuex'

  @Component({
    computed: mapState('broadcaster', [
      'message',
      'color'
    ])
  })
  export default class Broadcaster extends Vue {
    snackbar = false

    @Watch('message')
    toggleSnackbar (val) {
      this.snackbar = val.length > 0
    }

    @Watch('snackbar')
    clear (val) {
      !val && this.$store.commit('broadcaster/CLEAR')
    }
  }
</script>
