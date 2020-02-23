<template lang="pug">
  v-list-item(
    :input-value="selected"
    :dense="dense"
    ripple
    @click="$emit('click')"
  )
    v-list-item-action(v-if="optionAvatar")
      v-list-item-action-text {{ item[optionAvatar] }}
    v-list-item-content
      v-list-item-title {{ optionText ? item[optionText] : item }}
</template>

<script>
  export default {
    name: 'ListOption',
    props: {
      item: { type: null, required: true },
      optionAvatar: { type: String, default: null },
      optionText: { type: String, default: null },
      selected: { type: Boolean, default: false },
      dense: { type: Boolean, default: false }
    }
  }
</script>
