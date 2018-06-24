<template>
  <div class="d-inline-block" @click="open">
    <slot></slot>
    <v-dialog v-model="inForm" max-width="500px">
      <v-form v-model="valid" @submit.prevent="contract.id ? createContract() : updateContract()">
        <v-card>
          <v-card-title primary-title>
            <div class="headline">{{ title }}</div>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field
                    v-model="contract.wage"
                    label="Wage"
                    :prefix="team.currency"
                    required
                  ></v-text-field>
                </v-flex>

                <v-flex xs12>
                  <v-text-field
                    v-model="contract.signing_bonus"
                    label="Signing Bonus"
                    :prefix="team.currency"
                  ></v-text-field>
                </v-flex>

                <v-flex xs12>
                  <v-text-field
                    v-model="contract.release_clause"
                    label="Release Clause"
                    :prefix="team.currency"
                  ></v-text-field>
                </v-flex>

                <v-flex xs12>
                  <v-text-field
                    v-model="contract.performance_bonus"
                    label="Performance Bonus"
                    :prefix="team.currency"
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
                  <v-select
                    v-model="contract.bonus_req_type"
                    label="Bonus Req. Type"
                    :items="bonusRequirementTypes"
                  ></v-select>
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
            <v-btn type="submit" :disabled="!valid" flat large>Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex'

  export default {
    props: [
      'player',
      'contract'
    ],
    data: () => ({
      inForm: false,
      valid: false,
      errorMessage: ''
    }),
    computed: {
      ...mapState('team', {
        team: 'active'
      }),
      ...mapState('contract', [
        'bonusRequirementTypes'
      ]),
      title () {
        return this.contract && this.contract.id ? 'Update Contract' : 'Sign New Contract'
      },
      formError: {
        get: function () { return this.errorMessage.length > 0 },
        set: function (val) { this.errorMessage = val }
      }
    },
    methods: {
      ...mapActions('contract', [
        'create',
        'update'
      ]),
      open () {
        this.inForm = true
      },
      close () {
        this.inForm = false
        this.errorMessage = ''
      },
      createContract () {
        this.create({
          playerId: this.player.id,
          contract: this.contract
        }).then((data) => { this.close() })
          .catch((error) => { this.errorMessage = error.message })
      },
      updateContract () {
        this.update(this.contract)
          .then((data) => { this.close() })
          .catch((error) => { this.errorMessage = error.message })
      }
    },
    mounted () {
      if (!this.contract) {
        this.contract = {
          id: null,
          wage: 0,
          signing_bonus: null,
          release_clause: null,
          performance_bonus: null,
          bonus_req: null,
          bonus_req_type: null
        }
      }
    }
  }
</script>