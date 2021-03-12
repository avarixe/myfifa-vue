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
          v-model="loan.started_on"
          label="Start Date"
          prepend-icon="mdi-calendar-today"
          :min="record ? null : team.currently_on"
          color="indigo"
          required
        />
      </v-col>
      <v-col
        v-if="record && record.ended_on"
        cols="12"
      >
        <v-date-field
          v-model="loan.ended_on"
          label="Return Date"
          prepend-icon="mdi-calendar"
          :min="loan.started_on"
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
          v-model="loan.wage_percentage"
          label="Wage Percentage (%)"
          :rules="rulesFor.wage_percentage"
          inputmode="numeric"
        />
      </v-col>
      <v-col
        v-if="record && !record.ended_on"
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
        started_on: '',
        origin: '',
        destination: '',
        wage_percentage: null,
        returned: false
      },
      rulesFor: {
        origin: [isRequired('Origin')],
        destination: [isRequired('Destination')],
        wage_percentage: [
          isNumber('Wage Percentage'),
          inRange('Wage Percentage', [0, 100])
        ]
      }
    }),
    computed: {
      loanOut () {
        return this.record
          ? this.team.title === this.record.origin
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
              'started_on',
              'ended_on',
              'origin',
              'destination',
              'wage_percentage'
            ])
          } else {
            this.loan.started_on = this.team.currently_on
            if (this.loanOut) {
              this.loan.origin = this.team.title
            } else {
              this.loan.destination = this.team.title
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
