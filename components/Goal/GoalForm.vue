<template>
  <dialog-form
    v-model="dialog"
    title-icon="mdi-soccer"
    :title="title"
    :submit="submit"
    :color="color"
  >
    <template #activator="{ on }">
      <slot :on="on">
        <tooltip-button
          label="Goal"
          icon="mdi-soccer"
          color="blue"
          :on="on"
        />
      </slot>
    </template>
    <template #form>
      <v-col cols="12">
        <v-radio-group
          v-model="goal.home"
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
        <minute-field v-model="minute" />
      </v-col>
      <v-col cols="12">
        <player-select
          v-if="teamGoal"
          v-model="goal.playerId"
          :players="scorerOptions"
          label="Goal Scorer"
          required
        />
        <v-text-field
          v-else
          v-model="goal.playerName"
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
        <player-select
          v-if="teamGoal"
          v-model="goal.assistId"
          :players="assistOptions"
          label="Assisted By"
          icon="mdi-human-greeting"
          :disabled="goal.penalty || goal.ownGoal"
          clearable
          hide-details
        />
        <v-text-field
          v-else
          v-model="goal.assistedBy"
          label="Assisted By"
          prepend-icon="mdi-human-greeting"
          hide-details
          :disabled="goal.penalty || goal.ownGoal"
          spellcheck="false"
          autocapitalize="words"
          autocomplete="off"
          autocorrect="off"
        />
      </v-col>
      <v-col cols="12">
        <v-checkbox
          v-model="goal.penalty"
          label="Penalty"
          :disabled="goal.ownGoal"
          hide-details
        />
      </v-col>
      <v-col cols="12">
        <v-checkbox
          v-model="goal.ownGoal"
          label="Own Goal"
          :disabled="goal.penalty"
          hide-details
        />
      </v-col>
    </template>
  </dialog-form>
</template>

<script>
  import { mapActions } from 'vuex'
  import pick from 'lodash.pick'
  import { TeamAccessible, DialogFormable, MatchAccessible } from '@/mixins'
  import { isRequired } from '@/functions'

  export default {
    name: 'GoalForm',
    mixins: [
      TeamAccessible,
      DialogFormable,
      MatchAccessible
    ],
    props: {
      record: { type: Object, default: null }
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
      },
      rulesFor: {
        playerName: [isRequired('Goal Scorer')]
      }
    }),
    computed: {
      title () {
        return `${this.record ? 'Edit' : 'Record'} Goal`
      },
      scorerOptions () {
        return this.unsubbedPlayers.filter(cap =>
          cap.playerId !== this.goal.assistId
        )
      },
      assistOptions () {
        return this.unsubbedPlayers.filter(cap =>
          cap.playerId !== this.goal.playerId
        )
      },
      teamGoal () {
        return !this.goal.home ^ this.match.home === this.team.name
      }
    },
    watch: {
      dialog (val) {
        if (val && this.record) {
          this.goal = pick(this.record, [
            'id',
            'home',
            'playerId',
            'playerName',
            'assistedBy',
            'assistId',
            'ownGoal',
            'penalty'
          ])
          this.minute = this.record.minute
        }
      },
      'goal.assistId' (val) {
        if (!val && this.teamGoal) {
          this.goal.assistedBy = ''
        }
      },
      'goal.penalty' (val) {
        this.clearAssistedBy(val)
      },
      'goal.ownGoal' (val) {
        this.clearAssistedBy(val)
      }
    },
    methods: {
      ...mapActions('goals', {
        createGoal: 'create',
        updateGoal: 'update'
      }),
      clearNames () {
        this.goal.playerId = null
        this.goal.playerName = null
        this.goal.assistId = null
        this.goal.assistedBy = null
      },
      clearAssistedBy (val) {
        console.log(`clearAssistedBy `, val)
        if (val) {
          this.goal.assistId = null
          this.goal.assistedBy = null
        }
      },
      async submit () {
        const goal = {
          ...this.goal,
          minute: this.minute
        }

        if (this.record) {
          await this.updateGoal(goal)
        } else {
          await this.createGoal({
            matchId: this.match.id,
            goal
          })
        }
      }
    }
  }
</script>
