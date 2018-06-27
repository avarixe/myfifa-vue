<template>
  <v-tooltip bottom :color="color + ' darken-2'">
    <v-btn
      icon
      slot="activator"
      @click="open">
      <v-icon :color="color + ' darken-2'">fa-handshake</v-icon>
      <v-dialog v-model="inForm" max-width="500px">
        <v-form v-model="valid" @submit.prevent="loan.id ? updateLoan() : createLoan()">
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
                      label="Destination"
                      required
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12>
                    <v-checkbox
                      v-model="returned"
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
                :color="color + ' darken-2'"
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
    data: () => ({
      inForm: false,
      valid: false,
      errorMessage: '',
      loan: {
        destination: '',
        end_date: null
      },
      returned: false
    }),
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
      returned (val) {
        this.loan.end_date = val ? this.team.current_date : null
      }
    },
    methods: {
      ...mapActions('loan', [
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
      createLoan () {
        this.create({
          playerId: this.player.id,
          loan: this.loan
        }).then((data) => { this.close() })
          .catch((error) => { this.errorMessage = error.message })
      },
      updateLoan () {
        this.update(this.loan)
          .then((data) => { this.close() })
          .catch((error) => { this.errorMessage = error.message })
      }
    },
    mounted () {
      if (this.player.status === 'Loaned') {
        this.loan = this.player.last_loan
      }
    }
  }
</script>