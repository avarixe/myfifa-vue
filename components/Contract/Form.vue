<template lang="pug">
  dialog-form(
    v-model="dialog"
    :title="title"
    :submit="submit"
    color="blue"
  )
    template(#activator="{ on }")
      slot(:on="on")
        tooltip-button(
          :label="title"
          icon="mdi-file-document-outline"
          color="blue"
          :on="on"
        )
    template(#form)
      dynamic-fields(:object="contract" :fields="fields")
</template>

<script>
  import { mapActions } from 'vuex'
  import { addYears, format, parseISO } from 'date-fns'
  import pick from 'lodash.pick'
  import { DynamicFields, TooltipButton } from '@/helpers'
  import { TeamAccessible, DialogFormable } from '@/mixins'

  const bonusRequirementTypes = [
    'Appearances',
    'Goals',
    'Assists',
    'Clean Sheets'
  ]

  export default {
    name: 'ContractForm',
    components: {
      DynamicFields,
      TooltipButton
    },
    mixins: [
      DialogFormable,
      TeamAccessible
    ],
    props: {
      player: {
        type: Object,
        required: true
      },
      record: {
        type: Object,
        default: null
      },
      color: {
        type: String,
        default: null
      },
      dark: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      valid: false,
      contract: {
        started_on: null,
        ended_on: null,
        wage: null,
        signing_bonus: null,
        release_clause: null,
        performance_bonus: null,
        bonus_req: null,
        bonus_req_type: null
      }
    }),
    computed: {
      fields () {
        return [
          {
            type: 'date',
            attribute: 'started_on',
            label: 'Effective Date',
            prependIcon: 'mdi-calendar-today',
            min: this.team.currently_on,
            max: this.contract.ended_on,
            required: true
          },
          {
            type: 'date',
            attribute: 'ended_on',
            label: 'End Date',
            prependIcon: 'mdi-calendar',
            min: this.contract.started_on,
            max: this.maxEndDate,
            required: true,
            startWithYear: true
          },
          {
            type: 'money',
            attribute: 'wage',
            label: 'Wage',
            prefix: this.team.currency
          },
          {
            type: 'money',
            attribute: 'signing_bonus',
            label: 'Signing Bonus',
            prefix: this.team.currency
          },
          {
            type: 'money',
            attribute: 'release_clause',
            label: 'Release Clause',
            prefix: this.team.currency
          },
          {
            type: 'money',
            attribute: 'performance_bonus',
            label: 'Performance Bonus',
            prefix: this.team.currency
          },
          {
            cols: 6,
            type: 'string',
            attribute: 'bonus_req',
            label: 'Bonus Req.',
            prefix: 'if',
            inputmode: 'numeric',
            hidden: !this.contract.performance_bonus
          },
          {
            cols: 6,
            type: 'select',
            attribute: 'bonus_req_type',
            label: 'Bonus Req. Type',
            items: bonusRequirementTypes,
            clearable: true,
            hidden: !this.contract.performance_bonus
          }
        ]
      },
      title () {
        return this.record
          ? 'Edit Contract'
          : 'Sign New Contract'
      },
      maxEndDate () {
        return this.contract.started_on && format(
          addYears(parseISO(this.contract.started_on), 6),
          'yyyy-MM-dd'
        )
      }
    },
    watch: {
      dialog (val) {
        if (val) {
          if (this.record) {
            this.contract = pick(this.record, [
              'id',
              'started_on',
              'ended_on',
              'wage',
              'signing_bonus',
              'release_clause',
              'performance_bonus',
              'bonus_req',
              'bonus_req_type'
            ])
          } else {
            this.contract.started_on = this.team.currently_on
            this.contract.ended_on = this.team.currently_on
          }
        }
      }
    },
    methods: {
      ...mapActions('contracts', {
        createContract: 'CREATE',
        updateContract: 'UPDATE'
      }),
      async submit () {
        if (this.record) {
          await this.updateContract(this.contract)
        } else {
          await this.createContract({
            playerId: this.player.id,
            contract: this.contract
          })
        }
      }
    }
  }
</script>
