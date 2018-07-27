<template>
  <dialog-form
    v-model="dialog"
    :title="title"
    :submit="submit"
    :color="color">
    <slot slot="activator"></slot>
    <v-tooltip slot="activator" bottom :color="color">
      <v-btn slot="activator" icon>
        <v-icon :color="color">transfer_within_a_station</v-icon>
      </v-btn>
      {{ title }}
    </v-tooltip>
    <v-container slot="form">
      <v-layout wrap>
        <v-flex xs12>
          <v-text-field
            v-model="loan.destination"
            :rules="$_validate('Destination', ['required'])"
            label="Destination"
            prepend-icon="transfer_within_a_station"
          ></v-text-field>
        </v-flex>

        <v-flex xs12>
          <v-checkbox
            v-model="loan.returned"
            v-if="loan.id"
            label="Player Returned"
          ></v-checkbox>
        </v-flex>
      </v-layout>
    </v-container>
  </dialog-form>
</template>

<script>
  import { mapActions } from 'vuex'
  import FormBase from '@/mixins/FormBase'
  import PlayerAction from '@/mixins/PlayerAction'

  export default {
    mixins: [
      FormBase,
      PlayerAction
    ],
    data () {
      return {
        valid: !!this.player.active_loan,
        loan: Object.assign({
          destination: '',
          returned: false
        }, this.player.active_loan)
      }
    },
    computed: {
      title () {
        return this.loan && this.loan.id ? 'Update Loan' : 'Record New Loan'
      }
    },
    methods: {
      ...mapActions('loan', [
        'create',
        'update'
      ]),
      submit () {
        if ('id' in this.loan) {
          this.update(this.loan)
        } else {
          this.create({
            playerId: this.player.id,
            loan: this.loan
          })
        }
      }
    }
  }
</script>
