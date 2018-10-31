<template>
  <dialog-form
    v-model="dialog"
    :title="title"
    :submit="submit"
    :submit-cb="submitCb"
    color="indigo">
    <slot slot="activator">
      <v-tooltip bottom color="indigo">
        <v-btn slot="activator" icon>
          <v-icon color="indigo">mdi-transit-transfer</v-icon>
        </v-btn>
        {{ title }}
      </v-tooltip>
    </slot>
    <v-container slot="form">
      <v-layout wrap>
        <v-flex xs12>
          <v-text-field
            v-model="loan.destination"
            :rules="$_validate('Destination', ['required'])"
            label="Destination"
            prepend-icon="mdi-transit-transfer"
            spellcheck="false"
            autocapitalize="words"
            autocomplete="off"
            autocorrect="off"
          ></v-text-field>
        </v-flex>
        <v-scroll-y-transition mode="out-in">
          <v-flex v-if="loan.id" xs12>
            <v-checkbox
              v-model="loan.returned"
              label="Player Returned"
            ></v-checkbox>
          </v-flex>
        </v-scroll-y-transition>
      </v-layout>
    </v-container>
  </dialog-form>
</template>

<script>
  import { mapActions } from 'vuex'
  import DialogFormable from '@/mixins/DialogFormable'

  export default {
    mixins: [ DialogFormable ],
    props: {
      player: {
        type: Object,
        required: true
      },
      color: String,
      dark: Boolean,
      submitCb: Function
    },
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
