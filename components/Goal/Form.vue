<template>
  <dialog-form
    v-model="dialog"
    title-icon="mdi-soccer"
    title="Record Goal"
    :submit="submit"
    :color="color"
  >
    <template #activator="{ on }">
      <slot :on="on" />
    </template>

    <template #form>
      <v-container grid-list-xs>
        <v-layout wrap>
          <v-flex xs12>
            <v-radio-group
              v-model="goal.home"
              row
              hide-details
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
          </v-flex>
          <v-flex xs12>
            <minute-field
              v-model="minute"
              :extra-time="match.extra_time"
            />
          </v-flex>
          <v-flex xs12>
            <player-select
              v-if="teamGoal"
              v-model="goal.player_id"
              :players="scorerOptions"
              label="Goal Scorer"
              required
            />
            <v-text-field
              v-else
              v-model="goal.player_name"
              :rules="$_validate('Goal Scorer', ['required'])"
              label="Goal Scorer"
              prepend-icon="mdi-account"
              spellcheck="false"
              autocapitalize="words"
              autocomplete="off"
              autocorrect="off"
            />
          </v-flex>
          <v-flex xs12>
            <player-select
              v-if="teamGoal"
              v-model="goal.assist_id"
              :players="assistOptions"
              label="Assisted By"
              icon="mdi-human-greeting"
              :disabled="goal.penalty || goal.own_goal"
              clearable
              hide-details
            />
            <v-text-field
              v-else
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
          </v-flex>
          <v-flex xs12>
            <v-checkbox
              label="Penalty"
              v-model="goal.penalty"
              :disabled="goal.own_goal"
              hide-details
            />
          </v-flex>
          <v-flex xs12>
            <v-checkbox
              label="Own Goal"
              v-model="goal.own_goal"
              :disabled="goal.penalty"
              hide-details
            />
          </v-flex>
        </v-layout>
      </v-container>
    </template>
  </dialog-form>
</template>

<script>
  import { mixins, Component, Watch } from 'nuxt-property-decorator'
  import { MinuteField, PlayerSelect } from '@/helpers'
  import { TeamAccessible, DialogFormable, MatchAccessible } from '@/mixins'

  const mix = mixins(TeamAccessible, DialogFormable, MatchAccessible)

  @Component({
    components: {
      MinuteField,
      PlayerSelect
    }
  })
  export default class GoalForm extends mix {
    goal = {
      home: true, // default to Team side
      player_id: null,
      player_name: '',
      assisted_by: '',
      assist_id: '',
      own_goal: false,
      penalty: false
    }

    get scoredTeam () {
      return this.home ? this.match.home : this.match.away
    }

    get teamGoal () {
      return !this.goal.home ^ this.match.home === this.team.title
    }

    get scorerOptions () {
      return this.unsubbedPlayers.filter(cap =>
        cap.player_id !== this.goal.assist_id
      )
    }

    get assistOptions () {
      return this.unsubbedPlayers.filter(cap =>
        cap.player_id !== this.goal.player_id
      )
    }

    @Watch('goal.home')
    clearNames () {
      this.clearPlayerName()
      this.clearAssistedBy()
    }

    @Watch('goal.penalty')
    @Watch('goal.own_goal')
    clearAssistedBy () {
      this.goal.assist_id = null
      this.goal.assisted_by = null
    }

    clearPlayerName () {
      this.goal.player_name = ''
      this.goal.assisted_by = ''
    }

    async submit () {
      await this.$store.dispatch('goals/CREATE', {
        matchId: this.match.id,
        goal: {
          ...this.goal,
          minute: this.minute
        }
      })
    }
  }
</script>
