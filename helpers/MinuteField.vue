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
  import { Vue, Component } from 'vue-property-decorator'

  @Component({
    props: {
      value: {
        type: [String, Number]
      },
      extraTime: {
        type: Boolean
      }
    }
  })
  export default class MinuteField extends Vue {
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
