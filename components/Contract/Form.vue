<template>
  <dialog-form
    v-model="dialog"
    :title="title"
    :submit="submit"
    :submit-cb="submitCb"
    color="blue"
  >
    <template #activator="{ on }">
      <slot :on="on">
        <tooltip-button
          :label="title"
          icon="mdi-file-document-outline"
          color="blue"
          :on="on"
        />
      </slot>
    </template>

    <template #form>
      <v-col cols="12">
        <v-date-field
          v-model="contract.started_on"
          label="Effective Date"
          prepend-icon="mdi-calendar-today"
          :min="team.currently_on"
          :max="contract.ended_on"
          required
        />
      </v-col>
      <v-col cols="12">
        <v-date-field
          v-model="contract.ended_on"
          label="End Date"
          prepend-icon="mdi-calendar"
          :min="contract.started_on"
          :max="maxEndDate"
          required
          start-with-year
        />
      </v-col>
      <v-col cols="12">
        <v-money-field
          v-model="contract.wage"
          label="Wage"
          :prefix="team.currency"
          required
        />
      </v-col>
      <v-col cols="12">
        <v-money-field
          v-model="contract.signing_bonus"
          label="Signing Bonus"
          :prefix="team.currency"
        />
      </v-col>
      <v-col cols="12">
        <v-money-field
          v-model="contract.release_clause"
          label="Release Clause"
          :prefix="team.currency"
        />
      </v-col>
      <v-col cols="12">
        <v-money-field
          v-model="contract.performance_bonus"
          label="Performance Bonus"
          :prefix="team.currency"
        />
      </v-col>
      <v-scroll-y-transition mode="out-in">
        <v-row
          v-if="contract.performance_bonus"
          dense
        >
          <v-col cols="6">
            <v-text-field
              v-model="contract.bonus_req"
              label="Bonus Req."
              type="number"
              prefix="if"
            />
          </v-col>
          <v-col cols="6">
            <v-select
              v-model="contract.bonus_req_type"
              label="Bonus Req. Type"
              :items="bonusRequirementTypes"
              clearable
            />
          </v-col>
        </v-row>
      </v-scroll-y-transition>
    </template>
  </dialog-form>
</template>

<script>
  import { mixins, Component, Prop, Watch, namespace } from 'nuxt-property-decorator'
  import { addYears, format, parseISO } from 'date-fns'
  import pick from 'lodash.pick'
  import { VDateField, VMoneyField, TooltipButton } from '@/helpers'
  import { TeamAccessible, DialogFormable } from '@/mixins'

  const mix = mixins(DialogFormable, TeamAccessible)
  const contracts = namespace('contracts')

  @Component({
    components: {
      VDateField,
      VMoneyField,
      TooltipButton
    }
  })
  export default class ContractForm extends mix {
    @contracts.State bonusRequirementTypes
    @contracts.Action('CREATE') createContract
    @contracts.Action('UPDATE') updateContract
    @Prop({ type: Object, required: true }) player
    @Prop(Object) record
    @Prop(String) color
    @Prop(Boolean) dark
    @Prop(Function) submitCb

    valid = false
    contract = {
      started_on: null,
      ended_on: null,
      wage: null,
      signing_bonus: null,
      release_clause: null,
      performance_bonus: null,
      bonus_req: null,
      bonus_req_type: null
    }

    get title () {
      return this.record
        ? 'Edit Contract'
        : 'Sign New Contract'
    }

    get maxEndDate () {
      return this.contract.started_on && format(
        addYears(parseISO(this.contract.started_on), 6),
        'MMM dd, yyyy'
      )
    }

    @Watch('dialog')
    setContract (val) {
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
</script>
