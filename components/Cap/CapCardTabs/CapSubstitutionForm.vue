<script>
  import { reactive, toRef, computed, watchEffect, useStore } from '@nuxtjs/composition-api'
  import { useActivePlayers, useMatch } from '@/composables'

  export default {
    name: 'CapSubstitutionForm',
    props: {
      cap: { type: Object, required: true }
    },
    setup (props, { emit }) {
      const attributes = reactive({
        playerId: null,
        replacementId: '',
        injury: false
      })

      const cap = toRef(props, 'cap')
      watchEffect(() => {
        attributes.playerId = cap.value.playerId
      })

      const { sortedCaps, matchId, minute } = useMatch()

      const store = useStore()
      const saveSubstitution = async () => {
        await store.dispatch('substitutions/create', {
          matchId: matchId.id,
          attributes: {
            ...attributes,
            minute: minute.value
          }
        })
        emit('submitted')
      }

      const activePlayers = useActivePlayers()
      const availablePlayers = computed(() => {
        const selectedIds = sortedCaps.value.map(cap => cap.playerId)
        return activePlayers.value.filter(player =>
          selectedIds.includes(player.id)
        )
      })

      return {
        attributes,
        minute,
        availablePlayers,
        saveSubstitution
      }
    }
  }
</script>

<template>
  <base-form
    :submit="saveSubstitution"
    @reset="attributes.injury = false"
  >
    <template #default="{ valid, loading }">
      <div class="pa-2">
        <div class="text-subtitle-2 pb-2">
          Substitute Player
        </div>
        <minute-field v-model.number="minute" />
        <player-select
          v-model="attributes.replacementId"
          :players="availablePlayers"
          item-value="id"
          label="Replaced By"
          icon="mdi-subdirectory-arrow-right"
          required
        />
        <v-checkbox
          v-model="attributes.injury"
          label="Injury"
          hide-details
        />
        <div class="d-flex">
          <v-spacer />
          <v-btn
            type="submit"
            :disabled="!valid"
            primary
            text
            :loading="loading"
          >
            Save
          </v-btn>
        </div>
      </div>
    </template>
  </base-form>
</template>
