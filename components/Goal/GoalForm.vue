<script>
  import { ref, reactive, toRef, computed, watchEffect, useStore } from '@nuxtjs/composition-api'
  import { useMatch, useTeam } from '@/composables'
  import { isRequired } from '@/functions'

  export default {
    name: 'GoalForm',
    props: {
      record: { type: Object, required: true }
    },
    setup (props) {
      const attributes = reactive({
        home: true,
        playerId: null,
        playerName: '',
        assistedBy: '',
        assistId: '',
        ownGoal: false,
        penalty: false
      })

      const { match, minute, unsubbedPlayers } = useMatch()

      const scorerOptions = computed(() =>
        unsubbedPlayers.value.filter(cap => cap.playerId !== attributes.assistId)
      )

      const assistOptions = computed(() =>
        unsubbedPlayers.value.filter(cap => cap.playerId !== attributes.playerId)
      )

      const { team } = useTeam()
      const teamGoal = computed(() =>
        !attributes.home ^ match.value.home === team.value.name
      )

      const dialog = ref(false)
      const record = toRef(props, 'record')
      watchEffect(() => {
        if (dialog.value) {
          attributes.home = record.value.home
          attributes.playerId = record.value.playerId
          attributes.playerName = record.value.playerName
          attributes.assistedBy = record.value.assistedBy
          attributes.assistId = record.value.assistId
          attributes.ownGoal = record.value.ownGoal
          attributes.penalty = record.value.penalty
          minute.value = record.value.minute
        }
      })

      watchEffect(() => {
        if (!attributes.assistId && teamGoal.value) {
          attributes.assistedBy = null
        }

        if (attributes.ownGoal || attributes.penalty) {
          attributes.assistId = null
          attributes.assistedBy = null
        }
      })

      const clearNames = () => {
        attributes.playerId = null
        attributes.playerName = null
        attributes.assistId = null
        attributes.assistedBy = null
      }

      const store = useStore()
      const submit = async () => {
        await store.dispatch('goals/update', {
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
        match,
        clearNames,
        submit,
        scorerOptions,
        assistOptions,
        teamGoal,
        rulesFor: {
          playerName: [isRequired('Goal Scorer')]
        }
      }
    }
  }
</script>

<template>
  <dialog-form
    v-model="dialog"
    title-icon="mdi-soccer"
    title="Edit Goal"
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
        <v-radio-group
          v-model="attributes.home"
          row
          hide-details
          @change="clearNames"
        >
          <v-radio
            :label="match.home"
            :value="true"
            color="teal"
          />
          <v-radio
            :label="match.away"
            :value="false"
            color="pink"
          />
        </v-radio-group>
      </v-col>
      <v-col cols="12">
        <minute-field v-model.number="minute" />
      </v-col>
      <v-col cols="12">
        <cap-select
          v-if="teamGoal"
          v-model="attributes.playerId"
          :caps="scorerOptions"
          label="Goal Scorer"
          required
        />
        <v-text-field
          v-else
          v-model="attributes.playerName"
          label="Goal Scorer"
          prepend-icon="mdi-account"
          :rules="rulesFor.playerName"
          spellcheck="false"
          autocapitalize="words"
          autocomplete="off"
          autocorrect="off"
        />
      </v-col>
      <v-col cols="12">
        <cap-select
          v-if="teamGoal"
          v-model="attributes.assistId"
          :caps="assistOptions"
          label="Assisted By"
          icon="mdi-human-greeting"
          :disabled="attributes.penalty || attributes.ownGoal"
          clearable
          hide-details
        />
        <v-text-field
          v-else
          v-model="attributes.assistedBy"
          label="Assisted By"
          prepend-icon="mdi-human-greeting"
          hide-details
          :disabled="attributes.penalty || attributes.ownGoal"
          spellcheck="false"
          autocapitalize="words"
          autocomplete="off"
          autocorrect="off"
        />
      </v-col>
      <v-col cols="12">
        <v-checkbox
          v-model="attributes.penalty"
          label="Penalty"
          :disabled="attributes.ownGoal"
          hide-details
        />
      </v-col>
      <v-col cols="12">
        <v-checkbox
          v-model="attributes.ownGoal"
          label="Own Goal"
          :disabled="attributes.penalty"
          hide-details
        />
      </v-col>
    </template>
  </dialog-form>
</template>
