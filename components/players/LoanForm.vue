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
                      prepend-inner-icon="transfer_within_a_station"
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
    {{ title }}
  </v-tooltip>
</template>

<script>
  import { mapActions } from 'vuex'
  import FormMixin from '@/mixins/Form'
  import PlayerAction from '@/mixins/PlayerAction'

  export default {
    mixins: [ FormMixin, PlayerAction ],
    data () {
      return {
        valid: !!this.player.active_loan,
        loan: Object.assign({
          destination: '',
          returned: false
        }, this.player.active_loan)
      }
    },
    computed: {
      title () {
        return this.loan && this.loan.id ? 'Update Loan' : 'Record New Loan'
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
