<template lang="pug">
  area-chart(
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
  )
</template>

<script>
  import { Vue, Component, Prop } from 'nuxt-property-decorator'
  import { Contract, Team } from '@/models'

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

    get team () {
      return Team.find(this.$route.params.teamId)
    }

    get lastContract () {
      return Contract
        .query()
        .orderBy('ended_on')
        .where('player_id', this.player.id)
        .last()
    }

    get lastDate () {
      const contractEnd = this.lastContract && this.lastContract.ended_on
      return contractEnd && this.team.currently_on >= contractEnd
        ? contractEnd
        : this.team.currently_on
    }

    get chartData () {
      return this.player.histories.reduce((data, history) => {
        data[history.recorded_on] = history[this.attribute]
        return data
      }, {
        [this.lastDate]: this.player[this.attribute]
      })
    }
  }
</script>
