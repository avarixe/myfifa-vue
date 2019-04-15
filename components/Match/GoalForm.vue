<template>
  <dialog-form
    v-model="dialog"
    title-icon="mdi-soccer"
    title="Record Goal"
    :submit="submit"
    :color="color"
  >
    <slot
      slot="activator"
    />

    <v-container
      slot="form"
    >
      <v-layout
        wrap
      >
        <v-flex
          xs12
        >
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
        <v-flex
          xs12
        >
          <minute-field
            v-model="minute"
            :extra-time="match.extra_time"
          />
        </v-flex>
        <v-flex
          xs12
        >
          <player-select
            v-if="teamGoal"
            v-model="goal.player_id"
            :players="unsubbedPlayers"
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
        <v-flex
          xs12
        >
          <player-select
            v-if="teamGoal"
            v-model="goal.assist_id"
            :players="unsubbedPlayers"
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
        <v-flex
          xs12
        >
          <v-checkbox
            label="Penalty"
            v-model="goal.penalty"
            :disabled="goal.own_goal"
            hide-details
          />
        </v-flex>
        <v-flex
          xs12
        >
          <v-checkbox
            label="Own Goal"
            v-model="goal.own_goal"
            :disabled="goal.penalty"
            hide-details
          />
        </v-flex>
      </v-layout>
    </v-container>
  </dialog-form>
</template>

<script>
  import {
    MinuteField,
    PlayerSelect
  } from '@/helpers'
  import {
    TeamAccessible,
    DialogFormable,
    MatchAccessible
  } from '@/mixins'

  export default {
    components: {
      MinuteField,
      PlayerSelect
    },
    mixins: [
      DialogFormable,
      TeamAccessible,
      MatchAccessible
    ],
    data () {
      return {
        goal: {
          home: true, // default to Team side
          player_id: null,
          player_name: '',
          assisted_by: '',
          assist_id: '',
          own_goal: false,
          penalty: false
        }
      }
    },
    computed: {
      scoredTeam () {
        return this.home ? this.match.home : this.match.away
      },
      teamGoal () {
        return !this.goal.home ^ this.match.home === this.team.title
      }
    },
    watch: {
      'goal.home': function (val) {
        this.clearPlayerName()
        this.clearAssistedBy()
      },
      'goal.penalty': function (val) {
        this.clearAssistedBy()
      },
      'goal.own_goal': function (val) {
        this.clearAssistedBy()
      }
    },
    methods: {
      async submit () {
        await this.$store.dispatch('goals/CREATE', {
          matchId: this.match.id,
          goal: {
            ...this.goal,
            minute: this.minute
          }
        })
      },
      clearPlayerName () {
        this.goal.player_name = ''
        this.goal.assisted_by = ''
      },
      clearAssistedBy () {
        this.goal.assist_id = null
        this.goal.assisted_by = null
      }
    }
  }
</script>
