<template>
  <div>
    <template v-if="item.injured">
      <span class="font-weight-bold">{{ item.player_name }}</span> has been injured.
      Replaced by <span class="font-weight-bold">{{ item.replaced_by }}</span>
    </template>
    <template v-else>
      <span class="font-weight-bold">{{ item.player_name }}</span>
      replaced by <span class="font-weight-bold">{{ item.replaced_by }}</span>
    </template>
  </div>
</template>

<script>
  export default {
    props: {
      item: {
        type: Object,
        required: true
      }
    }
  }
</script>
