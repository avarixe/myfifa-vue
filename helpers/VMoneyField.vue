<template lang="pug">
  v-text-field(
    v-model="money"
    v-money="money ? config : null"
    :rules="rules"
    :label="label"
    :prefix="prefix"
    :clearable="!required"
    :autofocus="autofocus"
    inputmode="numeric"
  )
</template>

<script>
  import { VMoney } from 'v-money'
  import { requiredRule } from '@/helpers'

  export default {
    name: 'VMoneyField',
    directives: {
      money: VMoney
    },
    props: {
      value: {
        type: [String, Number],
        default: null
      },
      label: {
        type: String,
        required: true
      },
      prefix: {
        type: String,
        default: null
      },
      required: {
        type: Boolean,
        default: false
      },
      autofocus: {
        type: Boolean,
        default: false
      }
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
        return this.money && this.money.length > 0
          ? parseInt(this.money.replace(/,/g, ''))
          : null
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
