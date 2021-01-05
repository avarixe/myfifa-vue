<template>
  <div>
    <chartist
      type="Line"
      :ratio="ratio"
      :data="chartData"
      :options="chartOptions"
      :event-handlers="eventHandlers"
    />
    <v-menu
      v-model="tooltip.show"
      :position-x="tooltip.pos.x"
      :position-y="tooltip.pos.y"
      absolute
      offset-y
      nudge-bottom="10"
      eager
    >
      <v-sheet
        outlined
        rounded
        class="pa-2 text-center"
      >
        <div class="text-caption mb-2">{{ tooltip.value.x }}</div>
        <div
          class="body-1"
          :style="{ color }"
        >
          {{ prefix }}{{ tooltip.value.y.toLocaleString() }}
        </div>
      </v-sheet>
    </v-menu>
  </div>
</template>

<script>
  export default {
    name: 'PlayerHistoryChart',
    props: {
      chartData: { type: Object, required: true },
      color: { type: String, default: '#d70206' },
      min: { type: Number, default: null },
      max: { type: Number, default: null },
      prefix: { type: String, default: null },
      ratio: { type: String, default: 'ct-major-tenth' },
      showArea: { type: Boolean, default: false },
      tooltipXModifier: { type: Function, default: x => x },
      tooltipYModifier: { type: Function, default: y => y },
      axisX: { type: Object, default: () => ({}) }
    },
    data: () => ({
      tooltip: {
        show: false,
        pos: {
          x: 0,
          y: 0
        },
        value: {
          x: 0,
          y: 0
        }
      }
    }),
    computed: {
      chartOptions () {
        const prefix = this.prefix || ''
        return {
          axisX: this.axisX,
          axisY: {
            offset: 80,
            labelInterpolationFnc (value) {
              return `${prefix}${value.toLocaleString()}`
            }
          },
          low: this.min,
          high: this.max,
          onlyInteger: true,
          showArea: this.showArea
        }
      },
      eventHandlers () {
        return [{
          event: 'draw',
          fn: this.drawContext
        }]
      }
    },
    methods: {
      drawContext (context) {
        const node = context.element.getNode()
        const { showTooltip, hideTooltip } = this
        switch (context.type) {
          case 'area':
            context.element.attr({
              style: `fill: ${this.color}`
            })
            break
          case 'point':
            context.element.attr({
              style: `stroke: ${this.color}`
            })
            node.addEventListener('mouseover', function (evt) {
              showTooltip(context, evt)
              node.style.strokeWidth = '15px'
            })
            node.addEventListener('mouseout', function () {
              hideTooltip()
              node.style.strokeWidth = '10px'
            })
            break
          case 'line':
            context.element.attr({
              style: `stroke: ${this.color}`
            })
        }
      },
      showTooltip (context, evt) {
        this.tooltip = {
          show: true,
          pos: {
            x: evt.x,
            y: evt.y
          },
          value: {
            x: this.tooltipXModifier(context.value.x),
            y: this.tooltipYModifier(context.value.y)
          }
        }
      },
      hideTooltip () {
        this.tooltip.show = false
      }
    }
  }
</script>
