<template>
  <div>
    <p>Team #{{ teamId }} Dashboard</p>
  </div>
</template>

<script>
  export default {
    computed: {
      teamId () {
        return this.$route.params.team_id
      }
    }
  }
</script>