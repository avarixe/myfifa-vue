<template>
  <div>
    <v-tooltip
      :color="color"
      bottom
    >
      <template #activator="{ on }">
        <div
          :class="`display-1 ${color}--text`"
          v-on="on"
        >
          <v-icon
            class="display-1"
            :color="color"
          >
            mdi-{{ icon }}
          </v-icon>
          {{ formatter(endValue) }}
        </div>
      </template>
      {{ valueIncreased ? 'Increased' : 'Decreased' }} from
      {{ formatter(startValue) }} by {{ percentage.toFixed(2) }}%
    </v-tooltip>
    <div class="subheading">{{ label }}</div>
  </div>
</template>

<script>
  export default {
    name: 'DeltaStatistic',
    props: {
      label: { type: String, required: true },
      formatter: { type: Function, default: x => x },
      startValue: { type: [String, Number], default: null },
      endValue: { type: [String, Number], default: null }
    },
    computed: {
      color () {
        return this.valueIncreased ? 'green' : 'red'
      },
      icon () {
        return this.valueIncreased ? 'menu-up' : 'menu-down'
      },
      percentage () {
        return Math.abs((this.endValue - this.startValue) / this.startValue) * 100
      },
      valueIncreased () {
        return this.startValue <= this.endValue
      }
    }
  }
</script>
