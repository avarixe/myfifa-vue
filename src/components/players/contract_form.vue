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
                    <v-slider
                      v-model="contract.duration"
                      label="Duration"
                      :hint="contract.duration + ' Year(s)'"
                      min="1"
                      max="5"
                      thumb-label
                      ticks
                      persistent-hint
                      always-dirty
                    ></v-slider>
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
        valid: !!this.player.last_contract,
        errorMessage: '',
        contract: this.player.last_contract || {
          wage: null,
          duration: 1,
          signing_bonus: null,
          release_clause: null,
          performance_bonus: null,
          bonus_req: null,
          bonus_req_type: null
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
        return this.contract.id ? 'Update Contract' : 'Sign New Contract'
      },
      formError: {
        get: function () { return this.errorMessage.length > 0 },
        set: function (val) { this.errorMessage = val }
      }
    },
    watch: {
      inForm (val) {
        if (!val) {
          Object.assign(this.$data, this.$options.data.apply(this))
          // this.$refs.form.reset()
        }
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
