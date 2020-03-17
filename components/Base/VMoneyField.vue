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

<script>
  import { VMoney } from 'v-money'
  import { requiredRule } from '@/functions/rules'

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
    data: () => ({
      money: null,
      config: {
        decimal: '.',
        thousands: ',',
        precision: 0
      }
    }),
    computed: {
      moneyNum () {
        if (this.money) {
          const money = this.money.replace(/,/g, '')
          return money.length > 0 && !isNaN(money)
            ? parseInt(money)
            : null
        } else {
          return null
        }
      },
      rules () {
        return this.required ? [requiredRule({ label: this.label })] : []
      }
    },
    watch: {
      value: {
        handler () {
          this.money = this.value ? this.value.toString() : ''
        },
        immediate: true
      },
      money (value) {
        this.$emit('input', this.moneyNum)
      }
    }
  }
</script>
