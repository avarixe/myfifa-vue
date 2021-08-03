<template>
  <v-dialog
    v-model="dialog"
    :persistent="loading"
    max-width="500px"
  >
    <template #activator="{ on }">
      <slot
        name="activator"
        :on="on"
      />
    </template>
    <v-card>
      <v-card-title>
        <v-toolbar-title>
          <v-icon
            dark
            left
          >
            mdi-airplane
          </v-icon>
          Confirm Action
        </v-toolbar-title>
      </v-card-title>
      <v-card-text class="pt-4 pb-0">
        Activate Loan-to-Buy Option for {{ player.name }}?
      </v-card-text>
      <v-alert
        v-model="error"
        type="error"
        dismissible
        tile
      >
        {{ errorMessage }}
      </v-alert>
      <v-card-actions>
        <v-spacer />
        <v-btn
          text
          :disabled="loading"
          @click="dialog = false"
        >
          No
        </v-btn>
        <v-btn
          text
          color="red"
          :loading="loading"
          @click="activateBuyOption"
        >
          Yes
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import { mapActions } from 'vuex'
  import pick from 'lodash.pick'

  export default {
    name: 'LoanBuyOptionActivator',
    props: {
      player: { type: Object, required: true },
      loan: { type: Object, required: true }
    },
    data: () => ({
      dialog: false,
      loading: false,
      error: false,
      errorMessage: ''
    }),
    computed: {
      team () {
        return this.$store.$db().model('Team').find(this.$route.params.teamId)
      }
    },
    methods: {
      ...mapActions('loans', {
        updateLoan: 'update'
      }),
      async activateBuyOption () {
        try {
          this.loading = true
          await this.updateLoan({
            id: this.loan.id,
            attributes: {
              ...pick(this.loan, [
                'signedOn',
                'startedOn',
                'wage',
                'origin',
                'destination'
              ]),
              endedOn: this.team.currentlyOn,
              activatedBuyOption: true
            }
          })
          this.dialog = false
        } catch (e) {
          this.errorMessage = e.message
          this.error = true
        } finally {
          this.loading = false
        }
      }
    }
  }
</script>
