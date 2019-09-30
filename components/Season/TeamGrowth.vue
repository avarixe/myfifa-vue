<template>
  <delta-statistic
    :label="label"
    :formatter="formatter"
    :start-value="startValue"
    :end-value="endValue"
  />
</template>

<script>
  import { Vue, Component, Prop } from 'nuxt-property-decorator'
  import { Player, Contract, Team } from '@/models'
  import { DeltaStatistic } from '@/helpers'

  @Component({
    components: {
      DeltaStatistic
    }
  })
  export default class SeasonTeamGrowth extends Vue {
    @Prop({ type: String, required: true }) attribute
    @Prop({ type: String, required: true }) label
    @Prop({ type: Boolean, default: false }) average
    @Prop({ type: Function, default: x => x }) formatter
    @Prop(String) seasonStart
    @Prop(String) seasonEnd

    get team () {
      return Team.find(this.$route.params.teamId)
    }

    get contractsAtStart () {
      return Contract
        .query()
        .where(contract =>
          contract.started_on <= this.seasonStart &&
          this.seasonStart < contract.ended_on
        )
        .get()
    }

    get playersAtStart () {
      return Player
        .query()
        .with('histories')
        .where('team_id', this.team.id)
        .whereIdIn(this.contractsAtStart.map(contract => contract.player_id))
        .get()
    }

    get contractsAtEnd () {
      return Contract
        .query()
        .where(contract =>
          contract.started_on <= this.seasonEnd &&
          this.seasonEnd < contract.ended_on
        )
        .get()
    }

    get playersAtEnd () {
      return Player
        .query()
        .with('histories')
        .where('team_id', this.team.id)
        .whereIdIn(this.contractsAtEnd.map(contract => contract.player_id))
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
