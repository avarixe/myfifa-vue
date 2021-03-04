<template>
  <tr>
    <td class="stick-left pa-1">
      <v-btn
        v-if="saved"
        text
        @click="$emit('remove', player)"
      >
        <v-icon color="success">mdi-check-circle</v-icon>
      </v-btn>
      <v-tooltip
        v-else-if="error.length > 0"
        color="red"
        right
      >
        <template #activator="{ on }">
          <v-btn
            text
            v-on="on"
            @click="error = ''"
          >
            <v-icon color="red">mdi-alert</v-icon>
          </v-btn>
        </template>
        <v-icon
          left
          dark
        >
          mdi-alert
        </v-icon>
        {{ error }}
      </v-tooltip>
      <v-btn
        v-else
        text
        :loading="loading"
        @click="$emit('remove', player)"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </td>
    <td>
      <v-text-field
        v-model="player.name"
        label="Name"
        :rules="rulesFor.name"
        dense
        outlined
        hide-details
        spellcheck="false"
        autocapitalize="words"
        autocomplete="off"
        autocorrect="off"
      />
    </td>
    <td>
      <nationality-field
        v-model="player.nationality"
        :icon="null"
        dense
        outlined
        hide-details
      />
    </td>
    <td>
      <v-select
        v-model="player.pos"
        label="Position"
        :items="positions"
        :rules="rulesFor.pos"
        dense
        outlined
        hide-details
      />
    </td>
    <td>
      <v-select
        v-model="player.sec_pos"
        label="2nd Position(s)"
        :items="positions"
        multiple
        chips
        small-chips
        deletable-chips
        dense
        outlined
        hide-details
      />
    </td>
    <td>
      <v-text-field
        v-model="player.age"
        label="Age"
        :rules="rulesFor.age"
        dense
        outlined
        hide-details
        inputmode="numeric"
      />
    </td>
    <td>
      <v-text-field
        v-model="player.ovr"
        label="OVR"
        :rules="rulesFor.ovr"
        dense
        outlined
        hide-details
        input="numeric"
      />
    </td>
    <td>
      <v-money-field
        v-model="player.value"
        label="Value"
        :prefix="team.currency"
        required
        dense
        outlined
        hide-details
      />
    </td>
    <td>
      <v-text-field
        v-model="player.kit_no"
        label="Kit Number"
        :rules="rulesFor.kit_no"
        dense
        outlined
        hide-details
        inputmode="numeric"
      />
    </td>
    <td>
      <v-date-field
        v-model="contract.ended_on"
        label="Contract Ends"
        :min="contract.started_on"
        :max="maxEndDate"
        required
        dense
        outlined
        hide-details
        start-with-year
      />
    </td>
    <td>
      <v-money-field
        v-model="contract.wage"
        label="Wage"
        :prefix="team.currency"
        required
        dense
        outlined
        hide-details
      />
    </td>
    <td>
      <v-money-field
        v-model="contract.signing_bonus"
        label="Signing Bonus"
        :prefix="team.currency"
        dense
        outlined
        hide-details
      />
    </td>
    <td>
      <v-money-field
        v-model="contract.release_clause"
        label="Release Clause"
        :prefix="team.currency"
        dense
        outlined
        hide-details
      />
    </td>
    <td>
      <v-money-field
        v-model="contract.performance_bonus"
        label="Perf. Bonus"
        :prefix="team.currency"
        dense
        outlined
        hide-details
      />
    </td>
    <td>
      <v-text-field
        v-if="contract.performance_bonus"
        v-model="contract.bonus_req"
        label="Bonus Req."
        prefix="if"
        :rules="rulesFor.bonus_req"
        dense
        outlined
        hide-details
        inputmode="numeric"
      />
    </td>
    <td>
      <v-select
        v-if="contract.performance_bonus"
        v-model="contract.bonus_req_type"
        label="Bonus Req. Type"
        :items="bonusRequirementTypes"
        :rules="rulesFor.bonus_req_type"
        dense
        outlined
        hide-details
      />
    </td>
  </tr>
</template>

<script>
  import { mapActions } from 'vuex'
  import { addYears, format, parseISO } from 'date-fns'
  import { Team } from '@/models'
  import { positions } from '@/models/Player'
  import { requiredRule, formatRule, rangeRule } from '@/functions/rules'

  export default {
    name: 'PlayerImportRow',
    props: {
      player: { type: Object, required: true },
      submitted: { type: Number, default: 0 },
      cleared: { type: Number, default: 0 }
    },
    data: () => ({
      loading: false,
      saved: false,
      error: '',
      rulesFor: {
        name: [requiredRule({ label: 'Name' })],
        pos: [requiredRule({ label: 'Position' })],
        age: [
          requiredRule({ label: 'Age' }),
          formatRule({ label: 'Age', type: 'number' })
        ],
        ovr: [
          requiredRule({ label: 'OVR' }),
          formatRule({ label: 'OVR', type: 'number' }),
          rangeRule({ label: 'OVR', min: 40, max: 100 })
        ],
        kit_no: [
          formatRule({ label: 'Kit No', type: 'number' }),
          rangeRule({ label: 'Kit No', min: 1, max: 99 })
        ],
        bonus_req: [
          requiredRule({ label: 'Bonus Req.' }),
          formatRule({ label: 'Bonus Req.', type: 'number' })
        ],
        bonus_req_type: [requiredRule({ label: 'Bonus Req. Type' })]
      },
      bonusRequirementTypes: [
        'Appearances',
        'Goals',
        'Assists',
        'Clean Sheets'
      ]
    }),
    computed: {
      team () {
        return Team.find(this.$route.params.teamId)
      },
      contract () {
        return this.player.contracts_attributes[0]
      },
      positions () {
        return positions
      },
      maxEndDate () {
        return this.contract.started_on && format(
          addYears(parseISO(this.contract.started_on), 6),
          'yyyy-MM-dd'
        )
      }
    },
    watch: {
      submitted () {
        if (!this.loading && !this.saved) {
          this.savePlayer()
        }
      },
      cleared () {
        if (this.saved) {
          this.$emit('remove', this.player)
        }
      }
    },
    methods: {
      ...mapActions('players', {
        createPlayer: 'CREATE'
      }),
      async savePlayer () {
        try {
          this.loading = true
          await this.createPlayer({
            teamId: this.team.id,
            player: this.player
          })
          this.saved = true
        } catch (e) {
          this.error = e.message
        } finally {
          this.loading = false
        }
      }
    }
  }
</script>

<style scoped>
  td:not(:first-child) {
    padding: 4px;
  }
  td >>> .v-input {
    width: 150px
  }
</style>
