<template>
  <div>
    <fitty :options="options">
      <template #content>
        <slot>{{ text }}</slot>
      </template>
    </fitty>
  </div>
</template>

<script>
  export default {
    props: {
      text: String,
      options: {
        type: Object,
        default: () => ({
          minSize: 10,
          maxSize: 50
        })
      }
    }
  }
</script>
