<template>
  <v-text-field
    label="Minute"
    prepend-icon="mdi-timer"
    type="number"
    :rules="rules"
    :value="value"
    @input="updateValue"
  />
</template>

<script>
  import { Vue, Component, Prop } from 'nuxt-property-decorator'
  import { requiredRule } from '@/helpers'

  @Component
  export default class MinuteField extends Vue {
    @Prop([String, Number]) value

    get rules () {
      return [requiredRule({ label: 'Minute' })]
    }

    updateValue (value) {
      this.$emit('input', value)
    }
  }
</script>
