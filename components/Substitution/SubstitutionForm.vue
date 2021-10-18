<script>
  import {
    ref,
    toRef,
    reactive,
    computed,
    watchEffect,
    useStore
  } from '@nuxtjs/composition-api'
  import { useActivePlayers, useMatch } from '@/composables'

  export default {
    name: 'SubstitutionForm',
    props: {
      record: { type: Object, required: true }
    },
    setup (props) {
      const attributes = reactive({
        playerId: null,
        replacementId: '',
        injury: false
      })

      const { minute, sortedCaps, unsubbedPlayers } = useMatch()
      const record = toRef(props, 'record')

      const activePlayers = useActivePlayers()
      const availablePlayers = computed(() => {
        const selectedIds = sortedCaps.value.map(cap => cap.playerId)
        return activePlayers.value.filter(player => {
          if (selectedIds.indexOf(player.id) < 0) {
            return true
          } else if (record.value) {
            return player.id === record.value.replacementId
          }
        })
      })

      const dialog = ref(false)
      watchEffect(() => {
        if (dialog.value) {
          attributes.playerId = record.value.playerId
          attributes.replacementId = record.value.replacementId
          attributes.injury = record.value.injury
          minute.value = record.value.minute
        }
      })

      const store = useStore()
      const submit = async () => {
        await store.dispatch('substitutions/update', {
          id: record.value.id,
          attributes: {
            ...attributes,
            minute: minute.value
          }
        })
      }

      return {
        attributes,
        minute,
        dialog,
        submit,
        unsubbedPlayers,
        availablePlayers
      }
    }
  }
</script>

<template>
  <dialog-form
    v-model="dialog"
    title-icon="mdi-repeat"
    title="Edit Substitution"
    :submit="submit"
  >
    <template #activator="{ on }">
      <slot
        name="activator"
        :on="on"
      />
    </template>
    <template #form>
      <v-col cols="12">
        <minute-field v-model.number="minute" />
      </v-col>
      <v-col cols="12">
        <cap-select
          v-model="attributes.playerId"
          :caps="unsubbedPlayers"
          icon="mdi-subdirectory-arrow-left"
          required
        />
      </v-col>
      <v-col cols="12">
        <player-select
          v-model="attributes.replacementId"
          :players="availablePlayers"
          item-value="id"
          label="Replaced By"
          icon="mdi-subdirectory-arrow-right"
          required
        />
      </v-col>
      <v-col cols="12">
        <v-checkbox
          v-model="attributes.injury"
          label="Injury"
          hide-details
        />
      </v-col>
    </template>
  </dialog-form>
</template>
