<script>
  import { ref, reactive, toRefs, computed, watchEffect, useStore } from '@nuxtjs/composition-api'
  import { useTeam } from '@/composables'
  import { isRequired, isNumber, inRange } from '@/functions'

  export default {
    name: 'LoanForm',
    props: {
      player: { type: Object, required: true },
      record: { type: Object, default: null },
      color: { type: String, default: null },
      dark: { type: Boolean, default: false }
    },
    setup (props) {
      const attributes = reactive({
        signedOn: null,
        startedOn: null,
        endedOn: null,
        origin: null,
        destination: null,
        wagePercentage: null,
        transferFee: null,
        addonClause: 0
      })

      const { record, player } = toRefs(props)
      const loanOut = computed(() => {
        return record.value
          ? team.value.name === record.value.origin
          : player.value.status?.length > 0
      })

      const dialog = ref(false)
      const title = ref('Record New Loan')
      const { team } = useTeam()
      watchEffect(() => {
        if (dialog.value) {
          if (record.value) {
            attributes.signedOn = record.value.signedOn
            attributes.startedOn = record.value.startedOn
            attributes.endedOn = record.value.endedOn
            attributes.origin = record.value.origin
            attributes.destination = record.value.destination
            attributes.wagePercentage = record.value.wagePercentage
            attributes.transferFee = record.value.transferFee
            attributes.addonClause = record.value.addonClause
          } else {
            attributes.signedOn = team.value.currentlyOn
            attributes.startedOn = team.value.currentlyOn
            if (loanOut.value) {
              attributes.origin = team.value.name
            } else {
              attributes.destination = team.value.name
            }
          }
        }
      })

      watchEffect(() => {
        if (!attributes.addonClause) {
          attributes.addonClause = 0
        }
      })

      const store = useStore()
      const submit = async () => {
        if (record.value) {
          await store.dispatch('loans/update', {
            id: record.value.id,
            attributes
          })
        } else {
          await store.dispatch('loans/create', {
            playerId: player.value.id,
            attributes
          })
        }
      }

      return {
        attributes,
        dialog,
        title,
        loanOut,
        submit,
        team,
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
          required
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
