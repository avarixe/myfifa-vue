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
  import { Vue, Component, Prop } from 'nuxt-property-decorator'

  @Component
  export default class FittyText extends Vue {
    @Prop(String) text
    @Prop({ type: Number, default: 10 }) minSize
    @Prop({ type: Number, default: 50 }) maxSize

    get options () {
      return {
        minSize: this.minSize,
        maxSize: this.maxSize
      }
    }
  }
</script>
