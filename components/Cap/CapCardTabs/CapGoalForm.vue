<template>
  <base-form :submit="saveGoal">
    <template #default="{ valid, loading }">
      <div class="pa-2">
        <div class="text-subtitle-2 pb-2">
          Add Goal
        </div>
        <minute-field v-model="minute" />
        <player-select
          v-model="goal.assistId"
          :players="assistOptions"
          label="Assisted By"
          icon="mdi-human-greeting"
          :disabled="goal.penalty || goal.ownGoal"
          clearable
          hide-details
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
        playerId: null,
        playerName: '',
        assistedBy: '',
        assistId: '',
        ownGoal: false,
        penalty: false
      }
    }),
    computed: {
      assistOptions () {
        return this.unsubbedPlayers.filter(cap =>
          cap.playerId !== this.goal.playerId
        )
      }
    },
    watch: {
      cap: {
        immediate: true,
        handler (cap) {
          this.goal.playerId = cap.playerId
          this.goal.playerName = cap.name
        }
      },
      'match.home': {
        immediate: true,
        handler (home) {
          this.goal.home = home === this.team.name
        }
      }
    },
    methods: {
      ...mapActions('goals', {
        createGoal: 'create'
      }),
      clearAssistedBy (bool) {
        if (bool) {
          this.goal.assistId = null
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
