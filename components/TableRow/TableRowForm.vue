<script>
  import { ref, toRefs, reactive, watchEffect, useStore } from '@nuxtjs/composition-api'
  import { isNumber } from '@/functions'

  export default {
    name: 'TableRowForm',
    props: {
      stage: { type: Object, required: true },
      record: { type: Object, default: null }
    },
    setup (props) {
      const attributes = reactive({
        name: '',
        wins: null,
        draws: null,
        losses: null,
        goalsFor: null,
        goalsAgainst: null
      })

      const dialog = ref(false)
      const title = ref('Add Table Row')
      const { stage, record } = toRefs(props)
      watchEffect(() => {
        if (dialog.value && record.value) {
          attributes.name = record.value.name
          attributes.wins = record.value.wins
          attributes.draws = record.value.draws
          attributes.losses = record.value.losses
          attributes.goalsFor = record.value.goalsFor
          attributes.goalsAgainst = record.value.goalsAgainst
          title.value = 'Edit Table Row'
        }
      })

      const store = useStore()
      const submit = async () => {
        if (record.value) {
          await store.dispatch('tableRows/update', {
            id: record.value.id,
            attributes
          })
        } else {
          await store.dispatch('tableRows/create', {
            stageId: stage.value.id,
            attributes
          })
        }
      }

      return {
        attributes,
        dialog,
        title,
        submit,
        rulesForNumber: [isNumber()]
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
          icon="mdi-table-row-plus-after"
          :on="on"
        />
      </slot>
    </template>
    <template #form>
      <v-col cols="12">
        <team-combobox
          v-model="attributes.name"
          label="Team"
          prepend-icon="mdi-shield-half-full"
          hide-details
        />
      </v-col>
      <v-col cols="4">
        <v-text-field
          v-model.number="attributes.wins"
          prepend-icon="mdi-alpha-w"
          :rules="rulesForNumber"
          hide-details
          inputmode="numeric"
        />
      </v-col>
      <v-col cols="4">
        <v-text-field
          v-model.number="attributes.draws"
          prepend-icon="mdi-alpha-d"
          :rules="rulesForNumber"
          hide-details
          inputmode="numeric"
        />
      </v-col>
      <v-col cols="4">
        <v-text-field
          v-model.number="attributes.losses"
          prepend-icon="mdi-alpha-l"
          :rules="rulesForNumber"
          hide-details
          inputmode="numeric"
        />
      </v-col>
      <v-col cols="6">
        <v-text-field
          v-model.number="attributes.goalsFor"
          label="GF"
          prepend-icon="mdi-soccer"
          :rules="rulesForNumber"
          hide-details
          inputmode="numeric"
        />
      </v-col>
      <v-col cols="6">
        <v-text-field
          v-model.number="attributes.goalsAgainst"
          label="GA"
          prepend-icon="mdi-soccer"
          :rules="rulesForNumber"
          hide-details
          inputmode="numeric"
        />
      </v-col>
    </template>
  </dialog-form>
</template>
