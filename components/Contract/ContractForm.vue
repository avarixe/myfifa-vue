<script>
  import { ref, reactive, toRef, computed, watch, useStore } from '@nuxtjs/composition-api'
  import { addYears, format, parseISO } from 'date-fns'
  import { useTeam } from '@/composables'
  import { isRequired, isNumber } from '@/functions'

  export default {
    name: 'ContractForm',
    props: {
      player: { type: Object, required: true },
      record: { type: Object, default: null },
      color: { type: String, default: null },
      dark: { type: Boolean, default: false }
    },
    setup (props) {
      const attributes = reactive({
        startedOn: null,
        endedOn: null,
        numSeasons: null,
        wage: null,
        signingBonus: null,
        releaseClause: null,
        performanceBonus: null,
        bonusReq: null,
        bonusReqType: null
      })
      const numSeasonsOn = ref(true)

      const maxEndDate = computed(() =>
        attributes.startedOn && format(
          addYears(parseISO(attributes.startedOn), 6),
          'yyyy-MM-dd'
        )
      )

      const dialog = ref(false)
      const record = toRef(props, 'record')
      const title = ref('Sign New Contract')
      watch(dialog, open => {
        if (open) {
          if (record.value) {
            attributes.signedOn = record.value.signedOn
            attributes.startedOn = record.value.startedOn
            attributes.endedOn = record.value.endedOn
            attributes.wage = record.value.wage
            attributes.signingBonus = record.value.signingBonus
            attributes.releaseClause = record.value.releaseClause
            attributes.performanceBonus = record.value.performanceBonus
            attributes.bonusReq = record.value.bonusReq
            attributes.bonusReqType = record.value.bonusReqType
            numSeasonsOn.value = false
            title.value = 'Edit Contract'
          } else {
            attributes.signedOn = team.value.currentlyOn
            attributes.startedOn = team.value.currentlyOn
            numSeasonsOn.value = true
          }
        }
      })

      watch(attributes, () => {
        if (!attributes.performanceBonus) {
          attributes.bonusReq = null
          attributes.bonusReqType = null
        }
      })

      watch(numSeasonsOn, () => {
        if (numSeasonsOn.value) {
          attributes.numSeasons = null
        } else {
          delete attributes.numSeasons
        }
      })

      const store = useStore()
      const submit = async () => {
        if (record.value) {
          await store.dispatch('contracts/update', {
            id: record.value.id,
            attributes
          })
        } else {
          await store.dispatch('contracts/create', {
            playerId: props.player.id,
            attributes
          })
        }
      }

      const { team } = useTeam()
      return {
        dialog,
        attributes,
        numSeasonsOn,
        maxEndDate,
        submit,
        team,
        title,
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
        ]
      }
    }
  }
</script>

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
          required
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
