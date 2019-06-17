<template>
  <v-select
    :value="value"
    @input="updateValue"
    :items="minutes"
    :rules="$_validate('Minute', ['required'])"
    label="Minute"
    prepend-icon="mdi-timer"
  />
</template>

<script>
  import { Vue, Component, Prop } from 'nuxt-property-decorator'

  @Component
  export default class MinuteField extends Vue {
    @Prop([String, Number]) value
    @Prop(Boolean) extraTime

    get minutes () {
      return Array.from(
        { length: this.extraTime ? 120 : 90 },
        (v, k) => k + 1
      )
    }

    updateValue (value) {
      this.$emit('input', value)
    }
  }
</script>
