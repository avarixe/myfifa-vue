<template>
  <area-chart
    :data="data"
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
  export default {
    props: {
      player: {
        type: Object,
        required: true
      },
      attribute: {
        type: String,
        required: true
      },
      label: String,
      color: String,
      xtitle: String,
      ytitle: String,
      min: Number,
      max: Number,
      legend: String,
      prefix: String,
      thousands: String
    },
    computed: {
      data () {
        return this.player.histories.reduce((data, history) => {
          data[history.datestamp] = history[this.attribute]
          return data
        }, {})
      }
    }
  }
</script>
