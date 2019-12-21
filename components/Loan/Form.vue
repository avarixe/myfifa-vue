<template lang="pug">
  dialog-form(
    v-model="dialog"
    :title="title"
    :submit="submit"
    :submit-cb="submitCb"
    color="indigo"
  )
    template(#activator="{ on }")
      slot(:on="on")
        tooltip-button(
          :label="title"
          icon="mdi-transit-transfer"
          color="indigo"
          :on="on"
        )
    template(#form)
      dynamic-fields(:object="loan" :fields="fields")
</template>

<script>
  import { mixins, Component, Prop, Watch, namespace } from 'nuxt-property-decorator'
  import pick from 'lodash.pick'
  import { DynamicFields, TooltipButton } from '@/helpers'
  import { TeamAccessible, DialogFormable } from '@/mixins'

  const mix = mixins(DialogFormable, TeamAccessible)
  const loans = namespace('loans')

  @Component({
    components: {
      DynamicFields,
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

    get fields () {
      return [
        {
          type: 'date',
          attribute: 'started_on',
          label: 'Start Date',
          prependIcon: 'mdi-calendar-today',
          min: this.record ? null : this.team.currently_on,
          color: 'indigo',
          required: true
        },
        {
          type: 'date',
          attribute: 'ended_on',
          label: 'Return Date',
          prependIcon: 'mdi-calendar',
          min: this.loan.started_on,
          color: 'indigo',
          required: true,
          hidden: !(this.record && this.record.ended_on)
        },
        {
          type: 'string',
          attribute: 'origin',
          label: 'Origin',
          prependIcon: 'mdi-airplane-takeoff',
          disabled: this.loanOut,
          required: true,
          spellcheck: 'false',
          autocapitalize: 'words',
          autocomplete: 'off',
          autocorrect: 'off'
        },
        {
          type: 'string',
          attribute: 'destination',
          label: 'Destination',
          prependIcon: 'mdi-airplane-landing',
          disabled: !this.loanOut,
          required: true,
          spellcheck: 'false',
          autocapitalize: 'words',
          autocomplete: 'off',
          autocorrect: 'off'
        },
        {
          type: 'checkbox',
          attribute: 'returned',
          label: 'Player Returned',
          hidden: !this.record || this.record.ended_on
        }
      ]
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
