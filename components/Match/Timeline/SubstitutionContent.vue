<template>
  <div>
    <span class="font-weight-bold">{{ item.player_name }}</span>
    {{ action }}
    <span class="font-weight-bold">{{ item.replaced_by }}</span>
  </div>
</template>

<script>
  export default {
    props: {
      item: {
        type: Object,
        required: true
      }
    },
    computed: {
      action () {
        return this.item.injured
          ? 'has been injured. Replaced by'
          : 'replaced by'
      }
    }
  }
</script>
