<template>
  <v-text-field
    v-model="money"
    v-money="money ? config : null"
    :label="label"
    :prefix="prefix"
    :rules="rules"
    :clearable="!required"
  />
</template>

<script>
  import { Vue, Component, Prop, Watch } from 'nuxt-property-decorator'
  import { VMoney } from 'v-money'

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

    money = null
    config = {
      decimal: '.',
      thousands: ',',
      precision: 0
    }

    get rules () {
      return this.required
        ? this.$_validate(this.label, ['required'])
        : []
    }

    get moneyNum () {
      return this.money && this.money.length > 0
        ? parseInt(this.money.replace(/,/g, ''))
        : null
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
