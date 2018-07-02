<template>
  <v-tooltip bottom :color="color">
    <v-btn
      icon
      slot="activator"
      @click="inForm = true">
      <v-icon :color="color">transfer_within_a_station</v-icon>
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
                    <v-text-field
                      v-model="loan.destination"
                      :rules="$validate('Destination', ['required'])"
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

  export default {
    props: [
      'player',
      'color',
      'dark'
    ],
    data () {
      return {
        inForm: false,
        valid: !!this.player.active_loan,
        errorMessage: '',
        loan: Object.assign({
          destination: '',
          returned: false
        }, this.player.active_loan)
      }
    },
    computed: {
      ...mapState('team', {
        team: 'active'
      }),
      title () {
        return this.loan && this.loan.id ? 'Update Loan' : 'Record New Loan'
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
      ...mapActions('loan', [
        'create',
        'update'
      ]),
      save () {
        if (this.$refs.form.validate()) {
          let params, save
          if ('id' in this.loan) {
            params = this.loan
            save = this.update
          } else {
            params = { playerId: this.player.id, loan: this.loan }
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
