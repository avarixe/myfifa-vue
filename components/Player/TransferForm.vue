<template>
  <dialog-form
    v-model="dialog"
    :title="title"
    :submit="submit"
    :color="color">
    <v-tooltip
      slot="activator"
      bottom
      :color="color">
      <v-btn slot="activator" icon>
        <v-icon :color="color">
          flight_{{ transferOut ? 'takeoff' : 'land' }}
        </v-icon>
      </v-btn>
      Transfer {{ transferOut ? 'Out' : 'In' }}
    </v-tooltip>
    <v-container slot="form">
      <v-layout wrap>

        <v-flex xs12>
          <v-menu
            ref="menu"
            :close-on-content-click="false"
            v-model="menu"
            :return-value.sync="transfer.effective_date"
            lazy
            transition="scale-transition"
            full-width>
            <v-text-field
              slot="activator"
              label="Effective Date"
              prepend-icon="calendar_today"
              v-model="transfer.effective_date"
              required
              readonly
            ></v-text-field>
            <v-date-picker
              v-model="transfer.effective_date"
              landscape
              @input="$refs.menu.save(transfer.effective_date)"
            ></v-date-picker>
          </v-menu>
        </v-flex>
        <v-flex xs12>
          <v-text-field
            v-model="transfer.origin"
            :rules="$_validate('Origin', ['required'])"
            label="Origin"
            prepend-icon="flight_takeoff"
            :disabled="transferOut"
            spellcheck="false"
            autocapitalize="words"
            autocomplete="off"
            autocorrect="off"
          ></v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-text-field
            v-model="transfer.destination"
            :rules="$_validate('Destination', ['required'])"
            label="Destination"
            prepend-icon="flight_land"
            :disabled="!transferOut"
            spellcheck="false"
            autocapitalize="words"
            autocomplete="off"
            autocorrect="off"
          ></v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-text-field
            v-model="transfer.fee"
            type="number"
            label="Fee"
            :prefix="team.currency"
            :hint="$_numberHint(transfer.fee)"
            persistent-hint
          ></v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-text-field
            v-model="transfer.addon_clause"
            label="Add-On Clause (%)"
            :rules="$_validate('Add-On Clause', [{ type: 'range', options: { min: 0, max: 25 }}])"
            type="number"
            min="0"
            max="25"
          ></v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-checkbox
            v-model="transfer.loan"
            label="Loan"
            :disabled="transferOut"
          ></v-checkbox>
        </v-flex>
      </v-layout>
    </v-container>
  </dialog-form>
</template>

<script>
  import { mapActions } from 'vuex'
  import TeamAction from '@/mixins/TeamAction'
  import FormBase from '@/mixins/FormBase'
  import PlayerAction from '@/mixins/PlayerAction'

  export default {
    mixins: [
      FormBase,
      PlayerAction,
      TeamAction
    ],
    data: () => ({
      menu: false,
      transfer: {
        effective_date: null,
        origin: '',
        destination: '',
        fee: null,
        addon_clause: 0,
        loan: false
      }
    }),
    computed: {
      transferOut () {
        return this.player.status && this.player.status.length > 0
      },
      title () {
        return 'Transfer ' + this.player.name
      }
    },
    watch: {
      dialog (val) {
        if (val) {
          this.transfer.effective_date = this.team.current_date
          if (this.transferOut) {
            this.transfer.origin = this.team.title
          } else {
            this.transfer.destination = this.team.title
          }
        }
      }
    },
    methods: {
      ...mapActions('transfer', [ 'create' ]),
      async submit () {
        await this.create({
          playerId: this.player.id,
          transfer: this.transfer
        })
      }
    }
  }
</script>
