<template>
  <div>
    <p>The Teams Page</p>
  </div>
</template>

<script>
  export default {
    mounted () {
      this.$store.dispatch('team/getAllTeams')
    }
  }
</script>