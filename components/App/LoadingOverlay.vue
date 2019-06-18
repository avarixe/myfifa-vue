<template>
  <v-overlay :value="loading">
    <v-progress-circular
      :size="100"
      :width="7"
      color="primary"
      indeterminate
    />
  </v-overlay>
</template>

<script>
  import { Vue, Component } from 'nuxt-property-decorator'

  @Component
  export default class LoadingOverlay extends Vue {
    loading = false

    start () {
      this.loading = true
    }

    finish () {
      this.loading = false
    }
  }
</script>
