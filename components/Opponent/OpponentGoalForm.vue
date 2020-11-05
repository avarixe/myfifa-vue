<template>
  <base-form :submit="saveGoal">
    <template #default="{ valid, loading }">
      <div class="pa-2">
        <div class="text-subtitle-2 pb-2">
          Add Goal
        </div>
        <minute-field v-model="minute" />
        <v-text-field
          v-model="goal.player_name"
          label="Goal Scorer"
          prepend-icon="mdi-account"
          :rules="rules.player_name"
          spellcheck="false"
          autocapitalize="words"
          autocomplete="off"
          autocorrect="off"
        />
        <v-text-field
          v-model="goal.assisted_by"
          label="Assisted By"
          prepend-icon="mdi-human-greeting"
          :disabled="goal.penalty || goal.own_goal"
          hide-details
          spellcheck="false"
          autocapitalize="words"
          autocomplete="off"
          autocorrect="off"
        />
        <v-checkbox
          v-model="goal.penalty"
          label="Penalty"
          :disabled="goal.own_goal"
          hide-details
          @change="clearAssistedBy"
        />
        <v-checkbox
          v-model="goal.own_goal"
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
  import { requiredRule } from '@/functions/rules'

  export default {
    name: 'CapGoalForm',
    mixins: [
      TeamAccessible,
      MatchAccessible
    ],
    data: () => ({
      goal: {
        home: true,
        player_name: '',
        assisted_by: '',
        own_goal: false,
        penalty: false
      }
    }),
    computed: {
      rules () {
        return {
          player_name: [requiredRule({ label: 'Goal Scorer' })]
        }
      }
    },
    watch: {
      'match.home': {
        immediate: true,
        handler (home) {
          this.goal.home = home !== this.team.title
        }
      }
    },
    methods: {
      ...mapActions('goals', {
        createGoal: 'CREATE'
      }),
      clearAssistedBy (bool) {
        if (bool) {
          this.goal.assisted_by = null
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
