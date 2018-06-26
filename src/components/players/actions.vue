<template>
  <v-card flat>
    <v-card-text class="text-xs-center">
      <player-form :id="player.id" color="deep-orange">
        <v-tooltip bottom color="deep-orange">
          <v-btn icon slot="activator">
            <v-icon color="deep-orange">fa-user-edit</v-icon>
          </v-btn>
          <span>Edit</span>
        </v-tooltip>
      </player-form>
      <transfer-form
        :player="player"
        :color="active ? 'red' : 'green'"
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
        color="lime"
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
          <v-icon color="black">fa-user-times</v-icon>
        </v-btn>
        <span>Remove</span>
      </v-tooltip>

      <v-snackbar
        color="black"
        v-model="promptDeletion">
        Remove {{ player.name }}?
        <v-btn dark flat @click.native="deletePlayer(playerToDelete)">Yes</v-btn>
        <v-btn dark flat @click.native="promptDeletion = false">No</v-btn>
      </v-snackbar>
    </v-card-text>
  </v-card>
</template>

<script>
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
      active () {
        return this.player.status && this.player.status.length > 0
      }
    },
    components: {
      'player-form': PlayerForm,
      'contract-form': ContractForm,
      'injury-form': InjuryForm,
      'loan-form': LoanForm,
      'transfer-form': TransferForm
    }
  }
</script>