<template>
  <base-form :submit="saveGoal">
    <template #default="{ valid, loading }">
      <div class="pa-2">
        <div class="text-subtitle-2 pb-2">
          Add Goal
        </div>
        <minute-field v-model="minute" />
        <player-select
          v-model="goal.assist_id"
          :players="assistOptions"
          label="Assisted By"
          icon="mdi-human-greeting"
          :disabled="goal.penalty || goal.own_goal"
          clearable
          hide-details
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

  export default {
    name: 'CapGoalForm',
    mixins: [
      TeamAccessible,
      MatchAccessible
    ],
    props: {
      cap: { type: Object, required: true }
    },
    data: () => ({
      goal: {
        home: true,
        player_id: null,
        player_name: '',
        assisted_by: '',
        assist_id: '',
        own_goal: false,
        penalty: false
      }
    }),
    computed: {
      assistOptions () {
        return this.unsubbedPlayers.filter(cap =>
          cap.player_id !== this.goal.player_id
        )
      }
    },
    watch: {
      cap: {
        immediate: true,
        handler (cap) {
          this.goal.player_id = cap.player_id
          this.goal.player_name = cap.name
        }
      },
      'match.home': {
        immediate: true,
        handler (home) {
          this.goal.home = home === this.team.title
        }
      }
    },
    methods: {
      ...mapActions('goals', {
        createGoal: 'CREATE'
      }),
      clearAssistedBy (bool) {
        if (bool) {
          this.goal.assist_id = null
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
