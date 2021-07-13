<template>
  <dialog-form
    v-model="dialog"
    :title="title"
    :submit="submit"
    color="indigo"
  >
    <template #activator="{ on }">
      <slot :on="on">
        <tooltip-button
          :label="title"
          icon="mdi-transit-transfer"
          color="indigo"
          :on="on"
        />
      </slot>
    </template>
    <template #form>
      <v-col cols="12">
        <v-date-field
          v-model="loan.startedOn"
          label="Start Date"
          prepend-icon="mdi-calendar-today"
          :min="record ? null : team.currentlyOn"
          color="indigo"
          required
        />
      </v-col>
      <v-col
        v-if="record && record.endedOn"
        cols="12"
      >
        <v-date-field
          v-model="loan.endedOn"
          label="Return Date"
          prepend-icon="mdi-calendar"
          :min="loan.startedOn"
          color="indigo"
          required
        />
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="loan.origin"
          label="Origin"
          prepend-icon="mdi-airplane-takeoff"
          :rules="rulesFor.origin"
          :disabled="loanOut"
          spellcheck="false"
          autocapitalize="words"
          autocomplete="off"
          autocorrect="off"
        />
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="loan.destination"
          label="Destination"
          prepend-icon="mdi-airplane-landing"
          :rules="rulesFor.destination"
          :disabled="!loanOut"
          spellcheck="false"
          autocapitalize="words"
          autocomplete="off"
          autocorrect="off"
        />
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="loan.wagePercentage"
          label="Wage Percentage (%)"
          :rules="rulesFor.wagePercentage"
          inputmode="numeric"
        />
      </v-col>
      <v-col
        v-if="record && !record.endedOn"
        cols="12"
      >
        <v-checkbox
          v-model="loan.returned"
          label="Player Returned"
          hide-details
        />
      </v-col>
    </template>
  </dialog-form>
</template>

<script>
  import { mapActions } from 'vuex'
  import pick from 'lodash.pick'
  import { TeamAccessible, DialogFormable } from '@/mixins'
  import { isRequired, isNumber, inRange } from '@/functions'

  export default {
    name: 'LoanForm',
    mixins: [
      DialogFormable,
      TeamAccessible
    ],
    props: {
      player: { type: Object, required: true },
      record: { type: Object, default: null },
      color: { type: String, default: null },
      dark: { type: Boolean, default: false }
    },
    data: () => ({
      loan: {
        startedOn: '',
        origin: '',
        destination: '',
        wagePercentage: null,
        returned: false
      },
      rulesFor: {
        origin: [isRequired('Origin')],
        destination: [isRequired('Destination')],
        wagePercentage: [
          isNumber('Wage Percentage'),
          inRange('Wage Percentage', [0, 100])
        ]
      }
    }),
    computed: {
      loanOut () {
        return this.record
          ? this.team.name === this.record.origin
          : this.player.status && this.player.status.length > 0
      },
      title () {
        return this.record ? 'Update Loan' : 'Record New Loan'
      }
    },
    watch: {
      dialog (val) {
        if (val) {
          if (this.record) {
            this.loan = pick(this.record, [
              'id',
              'startedOn',
              'endedOn',
              'origin',
              'destination',
              'wagePercentage'
            ])
          } else {
            this.loan.startedOn = this.team.currentlyOn
            if (this.loanOut) {
              this.loan.origin = this.team.name
            } else {
              this.loan.destination = this.team.name
            }
          }
        }
      }
    },
    methods: {
      ...mapActions('loans', {
        createLoan: 'create',
        updateLoan: 'update'
      }),
      async submit () {
        if (this.record) {
          await this.updateLoan(this.loan)
        } else {
          await this.createLoan({
            playerId: this.player.id,
            loan: this.loan
          })
        }
      }
    }
  }
</script>
