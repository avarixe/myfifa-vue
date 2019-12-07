<template>
  <v-text-field
    v-rules.required
    :value="value"
    label="Minute"
    prepend-icon="mdi-timer"
    type="number"
    @input="updateValue"
  />
</template>

<script>
  import { Vue, Component, Prop } from 'nuxt-property-decorator'

  @Component
  export default class MinuteField extends Vue {
    @Prop([String, Number]) value

    updateValue (value) {
      this.$emit('input', value)
    }
  }
</script>
