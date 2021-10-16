<script>
  import { computed } from '@nuxtjs/composition-api'
  import { useMatch } from '@/composables'
  import { isRequired, inRange } from '@/functions'

  export default {
    name: 'MinuteField',
    props: {
      value: { type: [String, Number], default: null }
    },
    setup () {
      const { match } = useMatch()
      return {
        rules: computed(() => [
          isRequired('Minute'),
          inRange('Minute', [1, match.value.extraTime ? 120 : 90])
        ])
      }
    }
  }
</script>

<template>
  <v-text-field
    label="Minute"
    prepend-icon="mdi-timer"
    type="number"
    :rules="rules"
    :value="value"
    @input="$emit('input', $event)"
  />
</template>
