<template>
  <v-card-text id="actions" class="text-xs-center pa-0">
    <v-btn
      icon
      nuxt
      :to="$route.path + '/players/' + player.id">
      <v-icon color="primary">arrow_forward</v-icon>
    </v-btn>
    <player-form :initial-player="player" color="orange">
      <v-tooltip bottom color="orange">
        <v-btn icon slot="activator">
          <v-icon color="orange">edit</v-icon>
        </v-btn>
        Edit
      </v-tooltip>
    </player-form>
    <transfer-form :player="player"></transfer-form>
    <contract-form :player="player"></contract-form>
    <injury-form
      v-if="active"
      :player="player"
    ></injury-form>
    <loan-form
      v-if="active"
      :player="player"
    ></loan-form>
    <player-remove :player="player"></player-remove>
  </v-card-text>
</template>

<script>
  import TeamAction from '@/mixins/TeamAction'
  import PlayerForm from '@/components/Player/PlayerForm'
  import ContractForm from '@/components/Player/ContractForm'
  import InjuryForm from '@/components/Player/InjuryForm'
  import LoanForm from '@/components/Player/LoanForm'
  import TransferForm from '@/components/Player/TransferForm'
  import PlayerRemove from '@/components/Player/PlayerRemove'

  export default {
    components: {
      PlayerForm,
      ContractForm,
      InjuryForm,
      LoanForm,
      TransferForm,
      PlayerRemove
    },
    mixins: [ TeamAction ],
    props: {
      player: {
        type: Object,
        required: true
      }
    },
    data: () => ({
    }),
    computed: {
      active () {
        return this.player.status && this.player.status.length > 0
      },
      transferOut () {
        return this.active
      }
    }
  }
</script>
