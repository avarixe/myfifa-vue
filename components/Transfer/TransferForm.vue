<script>
  import { ref, reactive, toRefs, computed, watchEffect, useStore } from '@nuxtjs/composition-api'
  import { useTeam } from '@/composables'
  import { isRequired, isNumber, inRange } from '@/functions'

  export default {
    name: 'TransferForm',
    props: {
      player: { type: Object, required: true },
      record: { type: Object, default: null },
      dark: { type: Boolean, default: null }
    },
    setup (props) {
      const attributes = reactive({
        signedOn: null,
        movedOn: null,
        origin: '',
        destination: '',
        fee: null,
        addonClause: 0
      })

      const { player, record } = toRefs(props)
      const { team } = useTeam()
      const transferOut = computed(() => {
        return record.value
          ? team.value.name === record.value.origin
          : player.value.status?.length > 0
      })

      const transferColor = computed(() => transferOut.value ?  'red' : 'green')

      const dialog = ref(false)
      watchEffect(() => {
        if (dialog.value) {
          if (record.value) {
            attributes.signedOn = record.value.signedOn
            attributes.movedOn = record.value.movedOn
            attributes.origin = record.value.origin
            attributes.destination = record.value.destination
            attributes.fee = record.value.fee
            attributes.addonClause = record.value.addonClause
          } else {
            attributes.signedOn = team.value.currentlyOn
            attributes.movedOn = team.value.currentlyOn
            if (transferOut.value) {
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
          await store.dispatch('transfers/update', {
            id: record.value.id,
            attributes
          })
        } else {
          await store.dispatch('transfers/create', {
            playerId: player.value.id,
            attributes
          })
        }
      }

      return {
        attributes,
        dialog,
        submit,
        transferOut,
        transferColor,
        team,
        rulesFor: {
          origin: [isRequired('Origin')],
          destination: [isRequired('Destination')],
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
    :title="`Transfer ${player.name}`"
    :submit="submit"
  >
    <template #activator="{ on }">
      <slot
        name="activator"
        :on="on"
      >
        <tooltip-button
          :label="`Transfer ${transferOut ? 'Out' : 'In'}`"
          :icon="`mdi-airplane-${transferOut ? 'takeoff' : 'landing'}`"
          :color="transferColor"
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
          v-model="attributes.movedOn"
          label="Effective Date"
          prepend-icon="mdi-calendar-today"
          :min="attributes.signedOn"
          required
        />
      </v-col>
      <v-col cols="12">
        <team-combobox
          v-model="attributes.origin"
          label="Origin"
          prepend-icon="mdi-airplane-takeoff"
          :rules="rulesFor.origin"
          :disabled="transferOut"
        />
      </v-col>
      <v-col cols="12">
        <team-combobox
          v-model="attributes.destination"
          label="Destination"
          prepend-icon="mdi-airplane-landing"
          :rules="rulesFor.destination"
          :disabled="!transferOut"
        />
      </v-col>
      <v-col cols="12">
        <v-money-field
          v-model.number="attributes.fee"
          label="Fee"
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
