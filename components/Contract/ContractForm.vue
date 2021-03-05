<template>
  <dialog-form
    v-model="dialog"
    :title="title"
    :submit="submit"
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
              prefix="if"
              :rules="rulesFor.bonus_req"
              inputmode="numeric"
            />
          </v-col>
          <v-col cols="6">
            <v-select
              v-model="contract.bonus_req_type"
              label="Bonus Req. Type"
              :items="bonusRequirementTypes"
              :rules="rulesFor.bonus_req_type"
            />
          </v-col>
        </v-row>
      </v-scroll-y-transition>
    </template>
  </dialog-form>
</template>

<script>
  import { mapActions } from 'vuex'
  import { addYears, format, parseISO } from 'date-fns'
  import pick from 'lodash.pick'
  import { TeamAccessible, DialogFormable } from '@/mixins'
  import { isRequired } from '@/functions'

  export default {
    name: 'ContractForm',
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
      },
      rulesFor: {
        bonus_req: [isRequired('Bonus Req.')],
        bonus_req_type: [isRequired('Bonus Req. Type')]
      },
      bonusRequirementTypes: [
        'Appearances',
        'Goals',
        'Assists',
        'Clean Sheets'
      ]
    }),
    computed: {
      title () {
        return this.record ? 'Edit Contract' : 'Sign New Contract'
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
      },
      'contract.started_on' (val) {
        if (val && this.contract.ended_on && this.contract.ended_on < val) {
          this.contract.ended_on = val
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
