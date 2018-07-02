<template>
  <v-card-text id="actions" class="text-xs-center pa-0">
    <player-form :initial-player="player" color="orange">
      <v-tooltip bottom color="orange">
        <v-btn icon slot="activator">
          <v-icon color="orange">edit</v-icon>
        </v-btn>
        <span>Edit</span>
      </v-tooltip>
    </player-form>
    <transfer-form
      :player="player"
      :color="transferOut ? 'red' : 'green'"
      dark
    ></transfer-form>
    <contract-form
      :player="player"
      color="blue"
      dark
    ></contract-form>
    <injury-form
      v-if="active"
      :player="player"
      color="pink"
      dark
    ></injury-form>
    <loan-form
      v-if="active"
      :player="player"
      color="indigo"
      dark
    ></loan-form>
    <v-tooltip bottom color="black">
      <v-btn icon slot="activator" @click.native="promptDeletion = true">
        <v-icon color="black">remove_circle</v-icon>
      </v-btn>
      <span>Remove</span>
    </v-tooltip>

    <v-snackbar
      color="black"
      v-model="promptDeletion">
      Remove Player: {{ player.name }}?
      <v-btn dark flat @click.native="destroy(player.id)">Yes</v-btn>
      <v-btn dark flat @click.native="promptDeletion = false">No</v-btn>
    </v-snackbar>
  </v-card-text>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import PlayerForm from '@/components/players/form'
  import ContractForm from '@/components/players/contract_form'
  import InjuryForm from '@/components/players/injury_form'
  import LoanForm from '@/components/players/loan_form'
  import TransferForm from '@/components/players/transfer_form'

  export default {
    props: [
      'player'
    ],
    data: () => ({
      promptDeletion: false
    }),
    computed: {
      ...mapState('team', {
        team: 'active'
      }),
      active () {
        return this.player.status && this.player.status.length > 0
      },
      transferOut () {
        return this.active
      }
    },
    methods: mapActions('player', [
      'destroy'
    ]),
    components: {
      'player-form': PlayerForm,
      'contract-form': ContractForm,
      'injury-form': InjuryForm,
      'loan-form': LoanForm,
      'transfer-form': TransferForm
    }
  }
</script>
