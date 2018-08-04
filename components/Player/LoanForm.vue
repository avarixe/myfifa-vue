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
            spellcheck="false"
            autocapitalize="words"
            autocomplete="off"
            autocorrect="off"
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
        loan: {
          destination: '',
          returned: false
        }
      }
    },
    computed: {
      playerLoaned () {
        return this.player.status && this.player.status === 'Loaned'
      },
      title () {
        return this.playerLoaned
          ? 'Update Loan'
          : 'Record New Loan'
      }
    },
    watch: {
      async dialog (val) {
        if (val && this.playerLoaned) {
          try {
            const { data } = await this.getCurrentLoan({ playerId: this.player.id })
            this.loan = data
          } catch (e) {
            alert(e)
            this.dialog = false
          }
        }
      }
    },
    methods: {
      ...mapActions({
        getCurrentLoan: 'player/getCurrentLoan',
        create: 'loan/create',
        update: 'loan/update'
      }),
      async submit () {
        if ('id' in this.loan) {
          await this.update(this.loan)
        } else {
          await this.create({
            playerId: this.player.id,
            loan: this.loan
          })
        }
      }
    }
  }
</script>
