<template>
  <base-form :submit="saveGoal">
    <template #default="{ valid, loading }">
      <div class="pa-2">
        <div class="text-subtitle-2 pb-2">
          Add Goal
        </div>
        <minute-field v-model="minute" />
        <v-text-field
          v-model="goal.playerName"
          label="Goal Scorer"
          prepend-icon="mdi-account"
          :rules="rules.playerName"
          spellcheck="false"
          autocapitalize="words"
          autocomplete="off"
          autocorrect="off"
        />
        <v-text-field
          v-model="goal.assistedBy"
          label="Assisted By"
          prepend-icon="mdi-human-greeting"
          :disabled="goal.penalty || goal.ownGoal"
          hide-details
          spellcheck="false"
          autocapitalize="words"
          autocomplete="off"
          autocorrect="off"
        />
        <v-checkbox
          v-model="goal.penalty"
          label="Penalty"
          :disabled="goal.ownGoal"
          hide-details
          @change="clearAssistedBy"
        />
        <v-checkbox
          v-model="goal.ownGoal"
          label="Own Goal"
          :disabled="goal.penalty"
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

<script>
  import { mapActions } from 'vuex'
  import { TeamAccessible, MatchAccessible } from '@/mixins'
  import { isRequired } from '@/functions'

  export default {
    name: 'CapGoalForm',
    mixins: [
      TeamAccessible,
      MatchAccessible
    ],
    data: () => ({
      goal: {
        home: true,
        playerName: '',
        assistedBy: '',
        ownGoal: false,
        penalty: false
      }
    }),
    computed: {
      rules () {
        return {
          playerName: [isRequired('Goal Scorer')]
        }
      }
    },
    watch: {
      'match.home': {
        immediate: true,
        handler (home) {
          this.goal.home = home !== this.team.name
        }
      }
    },
    methods: {
      ...mapActions('goals', {
        createGoal: 'create'
      }),
      clearAssistedBy (bool) {
        if (bool) {
          this.goal.assistedBy = null
        }
      },
      async saveGoal () {
        await this.createGoal({
          matchId: this.match.id,
          goal: {
            ...this.goal,
            minute: this.minute
          }
        })
        this.$emit('submitted')
      }
    }
  }
</script>
