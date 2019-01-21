<template>
  <div
    v-if="loading"
    class="loading-page"
  >
    <v-progress-circular
      :size="100"
      :width="7"
      color="primary"
      indeterminate
    />
  </div>
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

<style scoped>
  .loading-page {
    display: flex;
    position: fixed;
    height: 100%;
    width: 100%;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.25);
    z-index: 2;
  }
</style>
