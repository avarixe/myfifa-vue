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
  export default {
    data: () => ({
      loading: false
    }),
    methods: {
      start () {
        this.loading = true
      },
      finish () {
        this.loading = false
      }
    }
  }
</script>
