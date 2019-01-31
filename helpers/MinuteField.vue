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
  export default {
    props: {
      value: {
        type: [String, Number]
      },
      extraTime: {
        type: Boolean
      }
    },
    computed: {
      minutes () {
        return Array.from(
          { length: this.extraTime ? 120 : 90 },
          (v, k) => k + 1
        )
      }
    },
    methods: {
      updateValue (value) {
        this.$emit('input', value)
      }
    }
  }
</script>
