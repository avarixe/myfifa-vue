<template>
  <v-tooltip bottom :color="color">
    <v-btn
      icon
      slot="activator"
      @click="open">
      <v-icon :color="color">
        fa-plane-{{ transferOut ? 'departure' : 'arrival' }}
      </v-icon>
      <v-dialog v-model="inForm" max-width="500px">
        <v-form v-model="valid" @submit.prevent="saveTransfer">
          <v-card>
            <v-card-title
              primary-title
              :class="color + ' accent-2'">
              <div class="headline">Transfer {{ player.name }}</div>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-container grid-list-md>
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
                      label="Origin"
                      :disabled="transferOut"
                      required
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field
                      v-model="transfer.destination"
                      label="Destination"
                      :disabled="!transferOut"
                      required
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field
                      v-model="transfer.fee"
                      type="number"
                      label="Fee"
                      :prefix="team.currency"
                      :hint="numberHint(transfer.fee)"
                      persistent-hint
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-slider
                      v-model="transfer.addon_clause"
                      label="Add-On Clause"
                      min="0"
                      max="25"
                      :thumb-label="transfer.addon_clause > 0 ? 'always' : true"
                      append-icon="fa-percent"
                      ticks
                    ></v-slider>
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
            </v-card-text>
            <v-alert
              type="error"
              v-model="formError"
              dismissible>
              {{ errorMessage }}
            </v-alert>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                type="submit"
                :disabled="!valid"
                :color="color"
                flat
                large
              >Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-dialog>
    </v-btn>
    <span>Transfer {{ transferOut ? 'Out' : 'In' }}</span>
  </v-tooltip>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import formMixin from '@/mixins/form'

  export default {
    mixins: [formMixin],
    props: [
      'player',
      'color',
      'dark'
    ],
    data: () => ({
      inForm: false,
      valid: false,
      errorMessage: '',
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
      ...mapState('team', {
        team: 'active'
      }),
      formError: {
        get: function () { return this.errorMessage.length > 0 },
        set: function (val) { this.errorMessage = val }
      },
      transferOut () {
        return this.player.last_transfer && this.player.last_transfer.destination === this.team.title
      }
    },
    methods: {
      ...mapActions('player', {
        save: 'transfer'
      }),
      open () {
        this.inForm = true
      },
      close () {
        this.inForm = false
        this.errorMessage = ''
        this.transfer = {
          effective_date: null,
          origin: '',
          destination: '',
          fee: null,
          addon_clause: 0,
          loan: false
        }
      },
      saveTransfer () {
        this.save({
          playerId: this.player.id,
          transfer: this.transfer
        }).then((data) => { this.close() })
          .catch((error) => { this.errorMessage = error.message })
      }
    },
    mounted () {
      this.transfer.effective_date = this.team.current_date
      if (this.transferOut) {
        this.transfer.origin = this.team.title
      } else {
        this.transfer.destination = this.team.title
      }
    }
  }
</script>