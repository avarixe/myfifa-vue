<template>
  <dialog-form
    v-model="dialog"
    :title="title"
    :submit="submit"
    :submit-cb="submitCb"
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
          :min="record ? null: team.currently_on"
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
          prepend-icon="mdi-calendar-today"
          color="indigo"
          required
        />
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="loan.origin"
          :rules="$_validate('Origin', ['required'])"
          label="Origin"
          prepend-icon="mdi-airplane-takeoff"
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
          :rules="$_validate('Destination', ['required'])"
          label="Destination"
          prepend-icon="mdi-airplane-landing"
          :disabled="!loanOut"
          spellcheck="false"
          autocapitalize="words"
          autocomplete="off"
          autocorrect="off"
        />
      </v-col>
      <v-scroll-y-transition mode="out-in">
        <v-col
          v-if="record && !record.ended_on"
          cols="12"
        >
          <v-checkbox
            v-model="loan.returned"
            label="Player Returned"
          />
        </v-col>
      </v-scroll-y-transition>
    </template>
  </dialog-form>
</template>

<script>
  import { mixins, Component, Prop, Watch, namespace } from 'nuxt-property-decorator'
  import pick from 'lodash.pick'
  import { VDateField, TooltipButton } from '@/helpers'
  import { TeamAccessible, DialogFormable } from '@/mixins'

  const mix = mixins(DialogFormable, TeamAccessible)
  const loans = namespace('loans')

  @Component({
    components: {
      VDateField,
      TooltipButton
    }
  })
  export default class LoanForm extends mix {
    @loans.Action('CREATE') createLoan
    @loans.Action('UPDATE') updateLoan
    @Prop({ type: Object, required: true }) player
    @Prop(Object) record
    @Prop(String) color
    @Prop(Boolean) dark
    @Prop(Function) submitCb

    loan = {
      started_on: '',
      origin: '',
      destination: '',
      returned: false
    }

    get loanOut () {
      return this.record
        ? this.team.title === this.record.origin
        : this.player.status && this.player.status.length > 0
    }

    get title () {
      return this.record
        ? 'Update Loan'
        : 'Record New Loan'
    }

    @Watch('dialog')
    setLoan (val) {
      if (val) {
        if (this.record) {
          this.loan = pick(this.record, [
            'id',
            'started_on',
            'ended_on',
            'origin',
            'destination'
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
</script>
