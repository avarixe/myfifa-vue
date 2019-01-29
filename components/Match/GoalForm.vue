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
          <v-select
            v-model="minute"
            :items="minutes"
            :rules="$_validate('Minute', ['required'])"
            label="Minute"
            prepend-icon="mdi-timer"
          />
        </v-flex>
        <v-flex
          xs12
        >
          <v-select
            v-if="teamGoal"
            v-model="goal.player_id"
            :rules="$_validate('Goal Scorer', ['required'])"
            :items="unsubbedPlayers"
            item-value="player_id"
            item-text="name"
            label="Goal Scorer"
            prepend-icon="mdi-account"
          >
            <template
              slot="item"
              slot-scope="data"
            >
              <v-list-tile-action>
                <v-list-tile-action-text
                  v-text="data.item.pos"
                />
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title
                  v-text="data.item.name"
                />
              </v-list-tile-content>
            </template>
          </v-select>
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
          <v-select
            v-if="teamGoal"
            v-model="goal.assist_id"
            :items="unsubbedPlayers"
            item-value="player_id"
            item-text="name"
            label="Assisted By"
            prepend-icon="mdi-account-outline"
            :disabled="goal.penalty || goal.own_goal"
            clearable
            hide-details
          >
            <template
              slot="item"
              slot-scope="data"
            >
              <v-list-tile-action>
                <v-list-tile-action-text
                  v-text="data.item.pos"
                />
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title
                  v-text="data.item.name"
                />
              </v-list-tile-content>
            </template>
          </v-select>
          <v-text-field
            v-else
            v-model="goal.assisted_by"
            label="Assisted By"
            prepend-icon="mdi-account-outline"
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
  import TeamAccessible from '@/mixins/TeamAccessible'
  import DialogFormable from '@/mixins/DialogFormable'
  import MatchAccessible from '@/mixins/MatchAccessible'

  export default {
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
        await this.$store.dispatch('entities/goals/CREATE', {
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
