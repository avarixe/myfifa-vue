<script>
  import { ref, reactive, toRef, watchEffect, useStore } from '@nuxtjs/composition-api'
  import Vue from 'vue'
  import { useTeam } from '@/composables'
  import { isRequired, isNumber } from '@/functions'

  export default {
    name: 'InjuryForm',
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
        duration: {
          length: null,
          timespan: null
        },
        description: ''
      })

      const { team } = useTeam()

      const dialog = ref(false)
      const title = ref('Record New Injury')
      const durationOn = ref(false)
      const record = toRef(props, 'record')
      watchEffect(() => {
        if (dialog.value) {
          if (record.value) {
            attributes.startedOn = record.value.startedOn
            attributes.endedOn = record.value.endedOn
            attributes.description = record.value.description
            durationOn.value = false
            title.value = 'Update Injury'
          } else {
            attributes.startedOn = team.value.currentlyOn
            attributes.endedOn = team.value.currentlyOn
            durationOn.value = true
          }
        }
      })

      watchEffect(() => {
        if (durationOn.value) {
          Vue.set(attributes, 'duration', {
            length: null,
            timespan: null
          })
        } else {
          Vue.delete(attributes, 'duration')
        }
      })

      const store = useStore()
      const submit = async () => {
        if (record.value) {
          await store.dispatch('injuries/update', {
            id: record.value.id,
            attributes
          })
        } else {
          await store.dispatch('injures/create', {
            playerId: props.player.id,
            attributes
          })
        }
      }

      return {
        attributes,
        dialog,
        submit,
        title,
        durationOn,
        rulesFor: {
          description: [isRequired('Description')],
          durationLength: [
            isRequired('Length of Duration'),
            isNumber('Length of Duration')
          ],
          durationTimespan: [isRequired('Timespan')]
        },
        timespans: [
          'Days',
          'Weeks',
          'Months',
          'Years'
        ],
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
          icon="mdi-ambulance"
          color="pink"
          :on="on"
        />
      </slot>
    </template>
    <template #form>
      <v-col cols="12">
        <v-date-field
          v-model="attributes.startedOn"
          label="Injury Date"
          prepend-icon="mdi-calendar-today"
          required
        />
      </v-col>
      <template v-if="durationOn && attributes.duration">
        <v-col cols="6">
          <v-text-field
            v-model.number="attributes.duration['length']"
            label="Length of Duration"
            prepend-icon="mdi-ruler"
            :rules="rulesFor.durationLength"
            inputmode="numeric"
          />
        </v-col>
        <v-col cols="6">
          <v-select
            v-model="attributes.duration.timespan"
            :items="timespans"
            label="Timespan"
            append-outer-icon="mdi-calendar"
            :rules="rulesFor.durationTimespan"
            @click:append-outer="durationOn = false"
          />
        </v-col>
      </template>
      <v-col
        v-else
        cols="12"
      >
        <v-date-field
          v-model="attributes.endedOn"
          label="Recovery Date"
          prepend-icon="mdi-calendar"
          :append-outer-icon="record ? null : 'mdi-ruler'"
          :min="attributes.startedOn"
          required
          @click:append-outer="durationOn = true"
        />
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="attributes.description"
          label="Description"
          prepend-icon="mdi-ambulance"
          :rules="rulesFor.description"
          spellcheck="false"
          autocapitalize="words"
          autocomplete="off"
          autocorrect="off"
        />
      </v-col>
    </template>
  </dialog-form>
</template>
