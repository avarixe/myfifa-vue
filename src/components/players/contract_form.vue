<template>
  <v-btn
    :dark="dark"
    :color="color + ' darken-2'"
    @click="open">
    Contract
    <v-dialog v-model="inForm" max-width="500px">
      <v-form v-model="valid" @submit.prevent="contract.id ? createContract() : updateContract()">
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
                  <v-text-field
                    v-model="contract.wage"
                    type="number"
                    label="Wage"
                    :prefix="team.currency"
                    :hint="numberHint(contract.wage)"
                    persistent-hint
                    required
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
            <v-btn
              type="submit"
              :disabled="!valid"
              :color="color + ' darken-2'"
              flat
              large
            >Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </v-btn>
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
      contract: {
        id: null,
        wage: null,
        signing_bonus: null,
        release_clause: null,
        performance_bonus: null,
        bonus_req: null,
        bonus_req_type: null
      }
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
      if (this.player.last_contract) {
        this.contract = this.player.last_contract
      }
    }
  }
</script>