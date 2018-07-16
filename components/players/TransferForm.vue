<template>
  <v-tooltip bottom :color="color">
    <v-btn
      icon
      slot="activator"
      @click="open">
      <v-icon :color="color">
        flight_{{ transferOut ? 'takeoff' : 'land' }}
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
                        prepend-inner-icon="calendar_today"
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
                      prepend-inner-icon="flight_takeoff"
                      :disabled="transferOut"
                      required
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field
                      v-model="transfer.destination"
                      label="Destination"
                      prepend-inner-icon="flight_land"
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
                      label="Add-On Clause (%)"
                      min="0"
                      max="25"
                      :thumb-label="transfer.addon_clause > 0 ? 'always' : true"
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
    Transfer {{ transferOut ? 'Out' : 'In' }}
  </v-tooltip>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import formMixin from '@/mixins/form'
  import playerAction from '@/mixins/playerAction'

  export default {
    mixins: [ formMixin, playerAction ],
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
      ...mapState('team', {
        team: 'active'
      }),
      transferOut () {
        return this.player.status && this.player.status.length > 0
      }
    },
    methods: {
      ...mapActions('player', {
        save: 'transfer'
      }),
      open () {
        this.inForm = true
        this.transfer.effective_date = this.team.current_date
        if (this.transferOut) {
          this.transfer.origin = this.team.title
        } else {
          this.transfer.destination = this.team.title
        }
      },
      saveTransfer () {
        this.save({
          playerId: this.player.id,
          transfer: this.transfer
        }).then((data) => { this.inForm = false })
          .catch((error) => { this.errorMessage = error.message })
      }
    }
  }
</script>
