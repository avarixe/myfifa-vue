<template lang="pug">
  div
    fitty(:options="options")
      template(#content)
        slot {{ text }}
</template>

<script>
  export default {
    name: 'FittyText',
    props: {
      text: { type: String, default: '' },
      minSize: { type: [Number, String], default: 10 },
      maxSize: { type: [Number, String], default: 50 }
    },
    computed: {
      options () {
        return {
          minSize: this.minSize,
          maxSize: this.maxSize
        }
      }
    }
  }
</script>
