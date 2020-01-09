<template lang="pug">
  .d-inline-block
    player-form(:record="player" color="orange")
      template(#default="{ on }")
        tooltip-button(
          label="Edit"
          icon="mdi-pencil"
          color="orange"
          :on="on"
        )
    transfer-form(:player="player")
    loan-form(
      :player="player"
      :record="player.status === 'Loaned' ? loan : null"
    )
    contract-form(:player="player")
    template(v-if="player.isActive")
      injury-form(
        :player="player"
        :record="player.status === 'Injured' ? injury : null"
      )
      player-retire(:player="player")
      player-release(:player="player")
    record-remove(
      :record="player"
      store="players"
      :label="player.name"
    )
</template>

<script>
  import { Loan, Injury } from '@/models'
  import ContractForm from '@/components/Contract/Form'
  import InjuryForm from '@/components/Injury/Form'
  import LoanForm from '@/components/Loan/Form'
  import TransferForm from '@/components/Transfer/Form'
  import PlayerRetire from './Retire'
  import PlayerRelease from './Release'
  import PlayerForm from './Form'

  export default {
    name: 'PlayerAction',
    components: {
      ContractForm,
      InjuryForm,
      LoanForm,
      TransferForm,
      PlayerRetire,
      PlayerRelease,
      PlayerForm
    },
    props: {
      player: {
        type: Object,
        required: true
      }
    },
    computed: {
      injury () {
        return Injury
          .query()
          .where('player_id', this.player.id)
          .last()
      },
      loan () {
        return Loan
          .query()
          .where('player_id', this.player.id)
          .last()
      }
    }
  }
</script>
