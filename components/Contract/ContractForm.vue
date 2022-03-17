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
          icon="mdi-file-document-outline"
          color="blue"
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
          label="Effective Date"
          prepend-icon="mdi-calendar-today"
          :min="attributes.signedOn"
          :max="attributes.endedOn"
          required
        />
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-if="numSeasonsOn"
          v-model.number="attributes.numSeasons"
          label="Number of Seasons"
          prepend-icon="mdi-pound"
          append-outer-icon="mdi-calendar"
          :rules="rulesFor.numSeasons"
          inputmode="numeric"
          @click:append-outer="numSeasonsOn = false"
        />
        <v-date-field
          v-else
          v-model="attributes.endedOn"
          label="End Date"
          prepend-icon="mdi-calendar"
          :append-outer-icon="record ? null : 'mdi-pound'"
          :min="attributes.startedOn"
          :max="maxEndDate"
          required
          start-with-year
          @click:append-outer="numSeasonsOn = true"
        />
      </v-col>
      <v-col cols="12">
        <v-money-field
          v-model.number="attributes.wage"
          label="Wage"
          :prefix="team.currency"
          required
        />
      </v-col>
      <v-col cols="12">
        <v-money-field
          v-model.number="attributes.signingBonus"
          label="Signing Bonus"
          :prefix="team.currency"
        />
      </v-col>
      <v-col cols="12">
        <v-money-field
          v-model.number="attributes.releaseClause"
          label="Release Clause"
          :prefix="team.currency"
        />
      </v-col>
      <v-col cols="12">
        <v-money-field
          v-model.number="attributes.performanceBonus"
          label="Performance Bonus"
          :prefix="team.currency"
        />
      </v-col>
      <v-scroll-y-transition mode="out-in">
        <v-row
          v-if="attributes.performanceBonus"
          dense
        >
          <v-col cols="6">
            <v-text-field
              v-model.number="attributes.bonusReq"
              label="Bonus Req."
              prefix="if"
              :rules="rulesFor.bonusReq"
              inputmode="numeric"
            />
          </v-col>
          <v-col cols="6">
            <v-select
              v-model="attributes.bonusReqType"
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
  import { isRequired, isNumber } from '@/functions'

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
      attributes: {
        startedOn: null,
        endedOn: null,
        numSeasons: null,
        wage: null,
        signingBonus: null,
        releaseClause: null,
        performanceBonus: null,
        bonusReq: null,
        bonusReqType: null
      },
      rulesFor: {
        numSeasons: [
          isRequired('Number of Seasons'),
          isNumber('Number of Seasons')
        ],
        bonusReq: [isRequired('Bonus Req.')],
        bonusReqType: [isRequired('Bonus Req. Type')]
      },
      bonusRequirementTypes: [
        'Appearances',
        'Goals',
        'Assists',
        'Clean Sheets'
      ],
      numSeasonsOn: true
    }),
    computed: {
      title () {
        return this.record ? 'Edit Contract' : 'Sign New Contract'
      },
      maxEndDate () {
        return this.attributes.startedOn && format(
          addYears(parseISO(this.attributes.startedOn), 6),
          'yyyy-MM-dd'
        )
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
              'wage',
              'signingBonus',
              'releaseClause',
              'performanceBonus',
              'bonusReq',
              'bonusReqType'
            ])
            this.numSeasonsOn = false
          } else {
            this.attributes.signedOn = this.team.currentlyOn
            this.attributes.startedOn = this.team.currentlyOn
            this.numSeasonsOn = true
          }
        }
      },
      'attributes.performanceBonus' (val) {
        if (!val) {
          this.attributes.bonusReq = null
          this.attributes.bonusReqType = null
        }
      },
      numSeasonsOn (numSeasonsOn) {
        if (numSeasonsOn) {
          this.$set(this.attributes, 'numSeasons', null)
        } else {
          this.$delete(this.attributes, 'numSeasons')
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
          await this.updateContract({
            id: this.record.id,
            attributes: this.attributes
          })
        } else {
          await this.createContract({
            playerId: this.player.id,
            attributes: this.attributes
          })
        }
      }
    }
  }
</script>
