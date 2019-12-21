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
  import { Vue, Component, Prop } from 'nuxt-property-decorator'
  import { Match } from '@/models'
  import { requiredRule, rangeRule } from '@/helpers'

  @Component
  export default class MinuteField extends Vue {
    @Prop([String, Number]) value

    get match () {
      return Match.find(this.$route.params.matchId)
    }

    get rules () {
      const label = 'Minute'
      return [
        requiredRule({ label }),
        rangeRule({ label, min: 1, max: this.match.extra_time ? 120 : 90 })
      ]
    }

    updateValue (value) {
      this.$emit('input', value)
    }
  }
</script>
