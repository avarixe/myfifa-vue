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
  import { Vue, Component, Prop } from 'nuxt-property-decorator'
  import { Team } from '@/models'

  @Component
  export default class DeltaStatistic extends Vue {
    @Prop({ type: String, required: true }) label
    @Prop({ type: Function, default: x => x }) formatter
    @Prop([String, Number]) startValue
    @Prop([String, Number]) endValue

    // required to use $_formatMoney as formatter
    get team () {
      return Team.find(this.$route.params.teamId)
    }

    get color () {
      return this.valueIncreased ? 'green' : 'red'
    }

    get icon () {
      return this.valueIncreased ? 'menu-up' : 'menu-down'
    }

    get percentage () {
      return Math.abs((this.endValue - this.startValue) / this.startValue) * 100
    }

    get valueIncreased () {
      return this.startValue <= this.endValue
    }
  }
</script>
