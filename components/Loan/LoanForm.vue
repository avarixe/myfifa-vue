<template>
  <dialog-form
    v-model="dialog"
    :title="title"
    :submit="submit"
  >
    <template #activator="{ on }">
      <slot
        name="activator"
        :on="on"
      >
        <tooltip-button
          :label="title"
          icon="mdi-transit-transfer"
          color="deep-orange"
          :on="on"
        />
      </slot>
    </template>
    <template #form>
      <v-col cols="12">
        <v-date-field
          v-model="attributes.signedOn"
          label="Signed Date"
          prepend-icon="mdi-calendar-edit"
          clearable
        />
      </v-col>
      <v-col cols="12">
        <v-date-field
          v-model="attributes.startedOn"
          label="Start Date"
          prepend-icon="mdi-calendar-today"
          :min="attributes.signedOn"
          :max="attributes.endedOn"
          required
        />
      </v-col>
      <v-col cols="12">
        <v-date-field
          v-model="attributes.endedOn"
          label="Return Date"
          prepend-icon="mdi-calendar"
          :min="attributes.startedOn"
          required
        />
      </v-col>
      <v-col cols="12">
        <team-combobox
          v-model="attributes.origin"
          label="Origin"
          prepend-icon="mdi-airplane-takeoff"
          :rules="rulesFor.origin"
          :disabled="loanOut"
        />
      </v-col>
      <v-col cols="12">
        <team-combobox
          v-model="attributes.destination"
          label="Destination"
          prepend-icon="mdi-airplane-landing"
          :rules="rulesFor.destination"
          :disabled="!loanOut"
        />
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model.number="attributes.wagePercentage"
          label="Wage Percentage (%)"
          :rules="rulesFor.wagePercentage"
          inputmode="numeric"
        />
      </v-col>
      <v-col cols="12">
        <v-money-field
          v-model.number="attributes.transferFee"
          label="Transfer Fee"
          :prefix="team.currency"
        />
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model.number="attributes.addonClause"
          label="Add-On Clause (%)"
          :rules="rulesFor.addonClause"
          inputmode="numeric"
        />
      </v-col>
    </template>
  </dialog-form>
</template>

<script>
  import { mapActions } from 'vuex'
  import pick from 'lodash.pick'
  import { format, parseISO, addYears } from 'date-fns'
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
      attributes: {
        signedOn: null,
        startedOn: null,
        endedOn: null,
        origin: null,
        destination: null,
        wagePercentage: null,
        transferFee: null,
        addonClause: 0
      },
      rulesFor: {
        origin: [isRequired('Origin')],
        destination: [isRequired('Destination')],
        wagePercentage: [
          isNumber('Wage Percentage'),
          inRange('Wage Percentage', [0, 100])
        ],
        addonClause: [
          isNumber('Add-On Clause'),
          inRange('Add-On Clause', [0, 25])
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
            this.attributes = pick(this.record, [
              'signedOn',
              'startedOn',
              'endedOn',
              'origin',
              'destination',
              'wagePercentage',
              'transferFee',
              'addonClause'
            ])
          } else {
            this.attributes.signedOn = this.team.currentlyOn
            this.attributes.startedOn = this.team.currentlyOn
            this.attributes.endedOn = format(
              addYears(parseISO(this.team.currentlyOn), 1),
              'yyyy-MM-dd'
            )
            if (this.loanOut) {
              this.attributes.origin = this.team.name
            } else {
              this.attributes.destination = this.team.name
            }
          }
        }
      },
      'attributes.addonClause' (addonClause) {
        if (!addonClause) {
          this.attributes.addonClause = 0
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
          await this.updateLoan({
            id: this.record.id,
            attributes: this.attributes
          })
        } else {
          await this.createLoan({
            playerId: this.player.id,
            attributes: this.attributes
          })
        }
      }
    }
  }
</script>
