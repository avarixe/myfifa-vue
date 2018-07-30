<template>
  <dialog-form
    v-model="dialog"
    title-icon="camera"
    title="Record Goal"
    :submit="submit"
    :color="color">
    <slot slot="activator"></slot>
    <v-container slot="form">
      <v-layout wrap>
        <v-flex xs12>
          <v-radio-group v-model="goal.home" row hide-details>
            <v-radio
              :label="match.home"
              :value="true"
              color="teal"
            ></v-radio>
            <v-radio
              :label="match.away"
              :value="false"
              color="pink"
            ></v-radio>
          </v-radio-group>
        </v-flex>
        <v-flex xs12>
          <v-select
            v-model="goal.minute"
            :items="Array.from({ length: 120 }, (v, k) => k + 1)"
            :rules="$_validate('Minute', ['required'])"
            label="Minute"
            prepend-icon="timer"
          ></v-select>
        </v-flex>
        <v-flex xs12>
          <v-select
            v-if="teamGoal"
            v-model="goal.player_id"
            :rules="$_validate('Goal Scorer', ['required'])"
            :items="match.match_logs"
            item-value="player_id"
            item-text="name"
            label="Goal Scorer"
            prepend-icon="person">
            <template slot="item" slot-scope="data">
              <v-list-tile-action>
                <v-list-tile-action-text>{{ data.item.pos }}</v-list-tile-action-text>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{ data.item.name }}</v-list-tile-title>
              </v-list-tile-content>
            </template>
          </v-select>
          <v-text-field
            v-else
            v-model="goal.player_name"
            :rules="$_validate('Goal Scorer', ['required'])"
            label="Goal Scorer"
            prepend-icon="person"
          ></v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-select
            v-if="teamGoal"
            v-model="goal.assist_id"
            :items="match.match_logs"
            item-value="player_id"
            item-text="name"
            label="Assisted By"
            prepend-icon="person_outline"
            :disabled="goal.penalty || goal.own_goal"
            clearable
            hide-details>
            <template slot="item" slot-scope="data">
              <v-list-tile-action>
                <v-list-tile-action-text>{{ data.item.pos }}</v-list-tile-action-text>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{ data.item.name }}</v-list-tile-title>
              </v-list-tile-content>
            </template>
          </v-select>
          <v-text-field
            v-else
            v-model="goal.assisted_by"
            label="Assisted By"
            prepend-icon="person_outline"
            :disabled="goal.penalty || goal.own_goal"
            hide-details
          ></v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-checkbox
            label="Penalty"
            v-model="goal.penalty"
            :disabled="goal.own_goal"
            hide-details
          ></v-checkbox>
        </v-flex>
        <v-flex xs12>
          <v-checkbox
            label="Own Goal"
            v-model="goal.own_goal"
            :disabled="goal.penalty"
            hide-details
          ></v-checkbox>
        </v-flex>
      </v-layout>
    </v-container>
  </dialog-form>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import TeamAction from '@/mixins/TeamAction'
  import FormBase from '@/mixins/FormBase'

  export default {
    mixins: [
      FormBase,
      TeamAction
    ],
    props: {
      match: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        goal: {
          home: true, // default to Team side
          minute: null,
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
      ...mapState('player', {
        players: 'list'
      }),
      scoredTeam () {
        return this.home ? this.match.home : this.match.away
      },
      teamGoal () {
        return !this.goal.home ^ this.match.home === this.team.title
      }
    },
    watch: {
      'goal.home': function (val) {
        if (val) {
          this.goal.player_name = ''
          this.goal.assisted_by = ''
        } else {
          this.goal.player_id = null
          this.goal.assist_id = null
        }
      },
      'goal.player_id': function (val) {
        this.goal.player_name = val
          ? this.players[val].name
          : ''
      },
      'goal.assist_id': function (val) {
        this.goal.assisted_by = val
          ? this.players[val].name
          : ''
      },
      'goal.penalty': function (val) {
        if (val) {
          this.goal.assist_id = null
        }
      },
      'goal.own_goal': function (val) {
        if (val) {
          this.goal.assist_id = null
        }
      }
    },
    methods: {
      ...mapActions('goal', [
        'create'
      ]),
      async submit () {
        await this.create({
          matchId: this.match.id,
          goal: this.goal
        })
      }
    }
  }
</script>
