<script>
  import { ref, reactive, toRef, computed, watch } from '@nuxtjs/composition-api'
  import { VMoney } from 'v-money'
  import { isRequired } from '@/functions'

  export default {
    name: 'VMoneyField',
    directives: {
      money: VMoney
    },
    props: {
      value: { type: [String, Number], default: null },
      label: { type: String, required: true },
      prefix: { type: String, default: null },
      required: { type: Boolean, default: false },
      autofocus: { type: Boolean, default: false },
      dense: { type: Boolean, default: false },
      outlined: { type: Boolean, default: false },
      hideDetails: { type: Boolean, default: false }
    },
    setup (props, { emit }) {
      const money = ref(null)
      const moneyNum = computed(() => {
        if (money.value) {
          const formattedMoney = money.value.replace(/,/g, '')
          return formattedMoney.length > 0 && !isNaN(formattedMoney)
            ? parseInt(formattedMoney)
            : null
        } else {
          return null
        }
      })

      const value = toRef(props, 'value')
      watch(value, () => {
        money.value = value.value ? value.value.toString() : ''
      }, { immediate: true })

      watch(money, () => emit('input', moneyNum.value))

      return {
        money,
        config: reactive({
          decimal: '.',
          thousands: ',',
          precision: 0
        }),
        rules: props.required ? [isRequired(props.label)] : []
      }
    }
  }
</script>

<template>
  <v-text-field
    v-model="money"
    v-money="money ? config : null"
    :rules="rules"
    :label="label"
    :prefix="prefix"
    :clearable="!required"
    :dense="dense"
    :outlined="outlined"
    :hide-details="hideDetails"
    :autofocus="autofocus"
    inputmode="numeric"
  />
</template>
