<template>
  <v-text-field
    v-model="money"
    v-money="money ? config : null"
    :label="label"
    :prefix="prefix"
    :rules="rules"
    clearable
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
    @Prop(Array) rules

    money = null
    config = {
      decimal: '.',
      thousands: ',',
      precision: 0
    }

    @Watch('value', { immediate: true })
    setMoney () {
      this.money = this.value
    }

    @Watch('money')
    emitValue (value) {
      this.$emit('input', value)
    }
  }
</script>
