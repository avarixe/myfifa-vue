<template>
  <v-text-field
    v-model="money"
    v-money="money ? config : null"
    :rules="rules"
    :label="label"
    :prefix="prefix"
    :clearable="!required"
    :autofocus="autofocus"
    inputmode="numeric"
  />
</template>

<script>
  import { Vue, Component, Prop, Watch } from 'nuxt-property-decorator'
  import { VMoney } from 'v-money'
  import { requiredRule } from '@/helpers'

  @Component({
    directives: {
      money: VMoney
    }
  })
  export default class VMoneyField extends Vue {
    @Prop([String, Number]) value
    @Prop({ type: String, required: true }) label
    @Prop(String) prefix
    @Prop({ type: Boolean, default: false }) required
    @Prop({ type: Boolean, default: false }) autofocus

    money = null
    config = {
      decimal: '.',
      thousands: ',',
      precision: 0
    }

    get moneyNum () {
      return this.money && this.money.length > 0
        ? parseInt(this.money.replace(/,/g, ''))
        : null
    }

    get rules () {
      return this.required ? [requiredRule({ label: this.label })] : []
    }

    @Watch('value', { immediate: true })
    setMoney () {
      this.money = this.value
        ? this.value.toString()
        : ''
    }

    @Watch('money')
    emitValue (value) {
      this.$emit('input', this.moneyNum)
    }
  }
</script>
