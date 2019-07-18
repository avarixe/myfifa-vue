<template>
  <area-chart
    :data="chartData"
    :label="label"
    :xtitle="xtitle"
    :ytitle="ytitle"
    :colors="[color]"
    :min="min"
    :max="max"
    :legend="legend"
    :prefix="prefix"
    :thousands="thousands"
  />
</template>

<script>
  import { Vue, Component, Prop } from 'nuxt-property-decorator'

  @Component
  export default class PlayerHistoryChart extends Vue {
    @Prop({ type: Object, required: true }) player
    @Prop({ type: String, required: true }) attribute
    @Prop(String) label
    @Prop(String) color
    @Prop(String) xtitle
    @Prop(String) ytitle
    @Prop(Number) min
    @Prop(Number) max
    @Prop(String) legend
    @Prop(String) prefix
    @Prop(String) thousands

    get chartData () {
      return this.player.histories.reduce((data, history) => {
        data[history.recorded_on] = history[this.attribute]
        return data
      }, {})
    }
  }
</script>
