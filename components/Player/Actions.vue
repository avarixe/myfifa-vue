<template>
  <div class="d-inline-block">
    <player-form
      :player-data="player"
      color="orange"
    >
      <template #default="{ on }">
        <tooltip-button
          label="Edit"
          icon="mdi-pencil"
          color="orange"
          :on="on"
        />
      </template>
    </player-form>
    <transfer-form :player="player" />
    <loan-form :player="player" />
    <contract-form :player="player" />
    <template v-if="player.isActive">
      <injury-form :player="player" />
      <player-retire :player="player" />
      <player-release :player="player" />
    </template>
    <record-remove
      :record="player"
      store="players"
      :label="player.name"
      :redirect="playersLink"
    />
  </div>
</template>

<script>
  import { Vue, Component, Prop } from 'nuxt-property-decorator'
  import ContractForm from '@/components/Contract/Form'
  import InjuryForm from '@/components/Injury/Form'
  import LoanForm from '@/components/Loan/Form'
  import TransferForm from '@/components/Transfer/Form'
  import PlayerRetire from './Retire'
  import PlayerRelease from './Release'
  import PlayerForm from './Form'
  import { RecordRemove, TooltipButton } from '@/helpers'

  @Component({
    components: {
      ContractForm,
      InjuryForm,
      LoanForm,
      TransferForm,
      PlayerRetire,
      PlayerRelease,
      PlayerForm,
      RecordRemove,
      TooltipButton
    }
  })
  export default class PlayerActions extends Vue {
    @Prop({ type: Object, required: true }) player

    get playersLink () {
      return {
        name: 'teams-teamId-players',
        params: {
          teamId: this.player.team_id
        }
      }
    }
  }
</script>
