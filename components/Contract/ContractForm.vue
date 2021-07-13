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
          v-model="contract.startedOn"
          label="Effective Date"
          prepend-icon="mdi-calendar-today"
          required
        />
      </v-col>
      <v-col cols="12">
        <v-date-field
          v-model="contract.endedOn"
          label="End Date"
          prepend-icon="mdi-calendar"
          :min="contract.startedOn"
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
          v-model="contract.signingBonus"
          label="Signing Bonus"
          :prefix="team.currency"
        />
      </v-col>
      <v-col cols="12">
        <v-money-field
          v-model="contract.releaseClause"
          label="Release Clause"
          :prefix="team.currency"
        />
      </v-col>
      <v-col cols="12">
        <v-money-field
          v-model="contract.performanceBonus"
          label="Performance Bonus"
          :prefix="team.currency"
        />
      </v-col>
      <v-scroll-y-transition mode="out-in">
        <v-row
          v-if="contract.performanceBonus"
          dense
        >
          <v-col cols="6">
            <v-text-field
              v-model="contract.bonusReq"
              label="Bonus Req."
              prefix="if"
              :rules="rulesFor.bonusReq"
              inputmode="numeric"
            />
          </v-col>
          <v-col cols="6">
            <v-select
              v-model="contract.bonusReqType"
              label="Bonus Req. Type"
              :items="bonusRequirementTypes"
              :rules="rulesFor.bonusReqType"
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
        startedOn: null,
        endedOn: null,
        wage: null,
        signingBonus: null,
        releaseClause: null,
        performanceBonus: null,
        bonusReq: null,
        bonusReqType: null
      },
      rulesFor: {
        bonusReq: [isRequired('Bonus Req.')],
        bonusReqType: [isRequired('Bonus Req. Type')]
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
        return this.contract.startedOn && format(
          addYears(parseISO(this.contract.startedOn), 6),
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
              'startedOn',
              'endedOn',
              'wage',
              'signingBonus',
              'releaseClause',
              'performanceBonus',
              'bonusReq',
              'bonusReqType'
            ])
          } else {
            this.contract.startedOn = this.team.currentlyOn
            this.contract.endedOn = this.team.currentlyOn
          }
        }
      },
      'contract.startedOn' (val) {
        if (val && this.contract.endedOn && this.contract.endedOn < val) {
          this.contract.endedOn = val
        }
      }
    },
    methods: {
      ...mapActions('contracts', {
        createContract: 'create',
        updateContract: 'update'
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
