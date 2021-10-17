<script>
  import { reactive, toRef, watchEffect, useStore } from '@nuxtjs/composition-api'
  import { useMatch } from '@/composables'
  import { isRequired } from '@/functions'

  export default {
    name: 'MatchSideGoalForm',
    props: {
      side: { type: String, required: true }
    },
    setup (props, { emit }) {
      const attributes = reactive({
        home: true,
        playerName: '',
        assistedBy: '',
        ownGoal: false,
        penalty: false
      })

      const side = toRef(props, 'side')
      watchEffect(() => {
        attributes.home = side.value === 'home'
        if (attributes.ownGoal || attributes.penalty) {
          attributes.assistedBy = null
        }
      })

      const store = useStore()
      const { matchId, minute } = useMatch()
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

      const resetAttributes = () => {
        attributes.ownGoal = false
        attributes.penalty = false
      }

      return {
        attributes,
        minute,
        saveGoal,
        resetAttributes,
        rules: {
          playerName: [isRequired('Goal Scorer')]
        }
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
        <v-text-field
          v-model="attributes.playerName"
          label="Goal Scorer"
          prepend-icon="mdi-account"
          :rules="rules.playerName"
          spellcheck="false"
          autocapitalize="words"
          autocomplete="off"
          autocorrect="off"
        />
        <v-text-field
          v-model="attributes.assistedBy"
          label="Assisted By"
          prepend-icon="mdi-human-greeting"
          :disabled="attributes.penalty || attributes.ownGoal"
          hide-details
          spellcheck="false"
          autocapitalize="words"
          autocomplete="off"
          autocorrect="off"
        />
        <v-checkbox
          v-model="attributes.penalty"
          label="Penalty"
          :disabled="attributes.ownGoal"
          hide-details
        />
        <v-checkbox
          v-model="attributes.ownGoal"
          label="Own Goal"
          :disabled="attributes.penalty"
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
