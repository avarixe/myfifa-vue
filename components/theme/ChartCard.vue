<template>
  <material-card
    v-bind="$attrs"
    class="v-card--material-chart"
    v-on="$listeners"
  >
    <template #header>
      <chartist
        :data="data"
        :event-handlers="eventHandlers"
        :options="options"
        :ratio="ratio"
        :responsive-options="responsiveOptions"
        :type="type"
      />
    </template>

    <slot />

    <template #actions>
      <slot name="actions" />
    </template>
  </material-card>
</template>

<script>
  import Card from './Card'

  export default {
    inheritAttrs: false,

    components: {
      'material-card': Card
    },

    props: {
      data: {
        type: Object,
        default: () => ({})
      },
      eventHandlers: {
        type: Array,
        default: () => ([])
      },
      options: {
        type: Object,
        default: () => ({})
      },
      ratio: {
        type: String,
        default: undefined
      },
      responsiveOptions: {
        type: Array,
        default: () => ([])
      },
      type: {
        type: String,
        required: true,
        validator: v => ['Bar', 'Line', 'Pie'].includes(v)
      }
    }
  }
</script>

<style lang="scss">
  .v-card--material-chart {
    .v-card--material__header {
      .ct-label {
        color: inherit;
        opacity: .7;
        font-size: 0.975rem;
        font-weight: 100;
      }

      .ct-grid{
        stroke: rgba(255, 255, 255, 0.2);
      }
      .ct-series-a .ct-point,
      .ct-series-a .ct-line,
      .ct-series-a .ct-bar,
      .ct-series-a .ct-slice-donut {
          stroke: rgba(255,255,255,.8);
      }
      .ct-series-a .ct-slice-pie,
      .ct-series-a .ct-area {
          fill: rgba(255,255,255,.4);
      }
    }
  }
</style>
