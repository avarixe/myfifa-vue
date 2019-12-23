<template lang="pug">
  v-text-field(
    label="Minute"
    prepend-icon="mdi-timer"
    type="number"
    :rules="rules"
    :value="value"
    @input="updateValue"
  )
</template>

<script>
  import { Match } from '@/models'
  import { requiredRule, rangeRule } from '@/helpers'

  export default {
    name: 'MinuteField',
    props: {
      value: {
        type: [String, Number],
        default: null
      }
    },
    computed: {
      match () {
        return Match.find(this.$route.params.matchId)
      },
      rules () {
        const label = 'Minute'
        return [
          requiredRule({ label }),
          rangeRule({ label, min: 1, max: this.match.extra_time ? 120 : 90 })
        ]
      }
    },
    methods: {
      updateValue (value) {
        this.$emit('input', value)
      }
    }
  }
</script>
