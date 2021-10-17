<script>
  import { toRefs, computed } from '@nuxtjs/composition-api'

  export default {
    name: 'DeltaStatistic',
    props: {
      label: { type: String, required: true },
      formatter: { type: Function, default: x => x },
      startValue: { type: [String, Number], default: null },
      endValue: { type: [String, Number], default: null }
    },
    setup (props) {
      const { startValue, endValue } = toRefs(props)

      const valueIncreased = computed(() => startValue.value <= endValue.value)
      const color = computed(() => valueIncreased.value ?  'green' : 'red')
      const icon = computed(() => valueIncreased.value ? 'menu-up' : 'menu-down')
      const percentage = computed(() =>
        Math.abs((endValue.value - startValue.value) / startValue.value) * 100
      )

      return {
        valueIncreased,
        color,
        icon,
        percentage
      }
    }
  }
</script>

<template>
  <div>
    <v-tooltip
      :color="color"
      bottom
    >
      <template #activator="{ on }">
        <div
          :class="`text-h4 ${color}--text`"
          v-on="on"
        >
          <v-icon
            class="text-h4"
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
