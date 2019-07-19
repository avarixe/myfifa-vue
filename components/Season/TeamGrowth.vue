<template>
  <div>
    <v-tooltip
      :color="color"
      bottom
    >
      <template #activator="{ on }">
        <div
          v-on="on"
          :class="`display-1 ${color}--text`"
        >
          <v-icon
            class="display-1"
            :color="color"
          >mdi-{{ icon }}</v-icon>
          {{ formatter(endValue) }}
        </div>
      </template>

      {{ startValue < endValue ? 'Increased' : 'Decreased' }} from
      {{ formatter(startValue) }} by {{ percentage.toFixed(2) }}%
    </v-tooltip>

    <div class="subheading">
      {{ label }}
    </div>
  </div>
</template>

<script>
  import { Vue, Component, Prop } from 'nuxt-property-decorator'
  import { Player, Team } from '@/models'

  @Component
  export default class SeasonTeamGrowth extends Vue {
    @Prop({ type: String, required: true }) attribute
    @Prop({ type: String, required: true }) label
    @Prop({ type: Boolean, default: false }) average
    @Prop({
      type: Function,
      default: x => x
    }) formatter
    @Prop(String) seasonStart
    @Prop(String) seasonEnd

    get team () {
      return Team.find(this.$route.params.teamId)
    }

    get playersAtStart () {
      return Player
        .query()
        .withAll()
        .where('team_id', this.team.id)
        .whereHas('contracts', query => {
          query.where(contract =>
            contract.started_on <= this.seasonStart &&
            this.seasonStart <= contract.ended_on
          )
        })
        .get()
    }

    get playersAtEnd () {
      return Player
        .query()
        .withAll()
        .where('team_id', this.team.id)
        .whereHas('contracts', query => {
          query.where(contract =>
            contract.started_on <= this.seasonEnd &&
            this.seasonEnd <= contract.ended_on
          )
        })
        .get()
    }

    get startValue () {
      const total = this.$_sum(
        this.playersAtStart.map(player =>
          player.recordAt(this.seasonStart)[this.attribute]
        )
      )
      return this.average ? total / this.playersAtStart.length : total
    }

    get endValue () {
      const total = this.$_sum(
        this.playersAtEnd.map(player =>
          player.recordAt(this.seasonEnd)[this.attribute]
        )
      )
      return this.average ? total / this.playersAtEnd.length : total
    }

    get color () {
      return this.startValue < this.endValue ? 'green' : 'red'
    }

    get icon () {
      return this.startValue < this.endValue ? 'menu-up' : 'menu-down'
    }

    get percentage () {
      return Math.abs((this.endValue - this.startValue) / this.startValue) * 100
    }
  }
</script>
