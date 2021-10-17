<script>
  import { reactive, toRef, computed, watchEffect, useStore } from '@nuxtjs/composition-api'
  import { useMatch } from '@/composables'

  export default {
    name: 'CapGoalForm',
    props: {
      cap: { type: Object, required: true }
    },
    setup (props, { emit }) {
      const attributes = reactive({
        home: true,
        playerId: null,
        playerName: '',
        assistedBy: '',
        assistId: '',
        ownGoal: false,
        penalty: false
      })

      const { unsubbedPlayers, isTeamHome, minute, matchId } = useMatch()

      const assistOptions = computed(() =>
        unsubbedPlayers.value.filter(cap => cap.playerId !== attributes.playerId)
      )

      const cap = toRef(props, 'cap')
      watchEffect(() => {
        attributes.playerId = cap.value.playerId
        attributes.playerName = cap.value.name
        attributes.home = isTeamHome.value
      })

      const clearAssistedBy = bool => {
        if (bool) {
          attributes.assistId = null
          attributes.assistedBy = null
        }
      }

      const resetAttributes = () => {
        attributes.ownGoal = false
        attributes.penalty = false
      }

      const store = useStore()
      const saveGoal = async () => {
        await store.dispatch('goals/create', {
          matchId: matchId.value,
          attributes: {
            ...attributes,
            minute: minute.value
          }
        })
        emit('submitted')
      }

      return {
        attributes,
        minute,
        assistOptions,
        clearAssistedBy,
        resetAttributes,
        saveGoal
      }
    }
  }
</script>

<template>
  <base-form
    :submit="saveGoal"
    @reset="resetAttributes"
  >
    <template #default="{ valid, loading }">
      <div class="pa-2">
        <div class="text-subtitle-2 pb-2">
          Add Goal
        </div>
        <minute-field v-model.number="minute" />
        <cap-select
          v-model="attributes.assistId"
          :caps="assistOptions"
          label="Assisted By"
          icon="mdi-human-greeting"
          :disabled="attributes.penalty || attributes.ownGoal"
          clearable
          hide-details
        />
        <v-checkbox
          v-model="attributes.penalty"
          label="Penalty"
          :disabled="attributes.ownGoal"
          hide-details
          @change="clearAssistedBy"
        />
        <v-checkbox
          v-model="attributes.ownGoal"
          label="Own Goal"
          :disabled="attributes.penalty"
          hide-details
          @change="clearAssistedBy"
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
