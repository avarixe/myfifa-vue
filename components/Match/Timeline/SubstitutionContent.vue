<template>
  <div>
    <span
      class="font-weight-bold"
      v-text="item.player_name"
    />
    {{ action }}
    <span
      class="font-weight-bold"
      v-text="item.replaced_by"
    />
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
