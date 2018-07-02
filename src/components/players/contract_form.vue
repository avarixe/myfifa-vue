<template>
  <v-tooltip bottom :color="color">
    <v-btn
      icon
      slot="activator"
      @click="inForm = true">
      <v-icon :color="color">fa-file-contract</v-icon>
      <v-dialog v-model="inForm" max-width="500px">
        <v-form ref="form" v-model="valid" @submit.prevent="save">
          <v-card>
            <v-card-title
              primary-title
              :class="color + ' accent-2'">
              <div class="headline">{{ title }}</div>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12>
                    <v-menu
                      ref="menu1"
                      :close-on-content-click="false"
                      v-model="menus.effective_date"
                      :return-value.sync="contract.effective_date"
                      lazy
                      transition="scale-transition"
                      full-width>
                      <v-text-field
                        slot="activator"
                        label="Effective Date"
                        v-model="contract.effective_date"
                        :rules="$validate('Effective Date', ['required', 'date'])"
                        readonly
                      ></v-text-field>
                      <v-date-picker
                        ref="picker1"
                        v-model="contract.effective_date"
                        landscape
                        :min="team.current_date"
                        :max="contract.end_date"
                        @input="$refs.menu1.save(contract.effective_date)"
                      ></v-date-picker>
                    </v-menu>
                  </v-flex>

                  <v-flex xs12>
                    <v-menu
                      ref="menu2"
                      :close-on-content-click="false"
                      v-model="menus.end_date"
                      :return-value.sync="contract.end_date"
                      lazy
                      transition="scale-transition"
                      full-width>
                      <v-text-field
                        slot="activator"
                        label="End Date"
                        v-model="contract.end_date"
                        :rules="$validate('End Date', ['required', 'date'])"
                        readonly
                      ></v-text-field>
                      <v-date-picker
                        ref="picker2"
                        v-model="contract.end_date"
                        landscape
                        :min="contract.effective_date"
                        :max="maxEndDate"
                        @input="$refs.menu2.save(contract.end_date)"
                      ></v-date-picker>
                    </v-menu>
                  </v-flex>

                  <v-flex xs12>
                    <v-text-field
                      v-model="contract.wage"
                      :rules="$validate('Wage', ['required'])"
                      type="number"
                      label="Wage"
                      :prefix="team.currency"
                      :hint="numberHint(contract.wage)"
                      persistent-hint
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12>
                    <v-text-field
                      v-model="contract.signing_bonus"
                      type="number"
                      label="Signing Bonus"
                      :prefix="team.currency"
                      :hint="numberHint(contract.signing_bonus)"
                      persistent-hint
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12>
                    <v-text-field
                      v-model="contract.release_clause"
                      type="number"
                      label="Release Clause"
                      :prefix="team.currency"
                      :hint="numberHint(contract.release_clause)"
                      persistent-hint
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12>
                    <v-text-field
                      v-model="contract.performance_bonus"
                      type="number"
                      label="Performance Bonus"
                      :prefix="team.currency"
                      :hint="numberHint(contract.performance_bonus)"
                      persistent-hint
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12 sm6>
                    <v-text-field
                      v-model="contract.bonus_req"
                      label="Bonus Req."
                      type="number"
                      prefix="if"
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12 sm6>
                    <v-autocomplete
                      v-model="contract.bonus_req_type"
                      label="Bonus Req. Type"
                      :items="bonusRequirementTypes"
                    ></v-autocomplete>
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
    <span>{{ title }}</span>
  </v-tooltip>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import { addYears } from 'date-fns'
  import formMixin from '@/mixins/form'

  export default {
    mixins: [formMixin],
    props: [
      'player',
      'color',
      'dark'
    ],
    data () {
      return {
        inForm: false,
        valid: !!this.player.active_contract,
        errorMessage: '',
        contract: Object.assign({
          effective_date: null,
          end_date: null,
          wage: null,
          signing_bonus: null,
          release_clause: null,
          performance_bonus: null,
          bonus_req: null,
          bonus_req_type: null
        }, this.player.active_contract),
        menus: {
          effective_date: false,
          end_date: false
        }
      }
    },
    computed: {
      ...mapState('team', {
        team: 'active'
      }),
      ...mapState('contract', [
        'bonusRequirementTypes'
      ]),
      title () {
        return ('id' in this.contract) ? 'Update Contract' : 'Sign New Contract'
      },
      formError: {
        get: function () { return this.errorMessage.length > 0 },
        set: function (val) { this.errorMessage = val }
      },
      maxEndDate () {
        return this.$format(addYears(this.$parse(this.contract.effective_date), 6))
      }
    },
    watch: {
      inForm (val) {
        if (val) {
          this.contract.effective_date = this.contract.effective_date || this.team.current_date
        } else {
          Object.assign(this.$data, this.$options.data.apply(this))
          // this.$refs.form.reset()
        }
      },
      'menus.end_date' (val, oldVal) {
        return !oldVal && val && this.$nextTick(() => (this.$refs.picker2.activePicker = 'YEAR'))
      }
    },
    methods: {
      ...mapActions('contract', [
        'create',
        'update'
      ]),
      save () {
        if (this.$refs.form.validate()) {
          let params, save
          if ('id' in this.contract) {
            params = this.contract
            save = this.update
          } else {
            params = { playerId: this.player.id, contract: this.contract }
            save = this.create
          }

          save(params)
            .then((data) => { this.inForm = false })
            .catch((error) => { this.errorMessage = error.message })
        }
      }
    }
  }
</script>
