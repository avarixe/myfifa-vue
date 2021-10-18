<script>
  import { ref, toRefs, computed, watch, useStore } from '@nuxtjs/composition-api'
  import { addYears, format, parseISO } from 'date-fns'
  import { useTeam } from '@/composables'
  import { positions } from '@/constants'
  import { isRequired, isNumber, inRange } from '@/functions'

  export default {
    name: 'PlayerImportRow',
    props: {
      player: { type: Object, required: true },
      submitted: { type: Number, default: 0 },
      cleared: { type: Number, default: 0 }
    },
    setup (props, { emit }) {
      const { player, submitted, cleared } = toRefs(props)
      const contract = computed(() => player.value.contractsAttributes[0])

      const maxEndDate = computed(() => {
        return contract.value.startedOn && format(
          addYears(parseISO(contract.value.startedOn), 6),
          'yyyy-MM-dd'
        )
      })

      const loading = ref(false)
      const saved = ref(false)
      const error = ref('')
      const { team } = useTeam()
      const store = useStore()
      const savePlayer = async () => {
        try {
          loading.value = true

          const attributes = { ...player.value }
          delete attributes.rowId
          await store.dispatch('players/create', {
            teamId: team.value.id,
            attributes
          })
          saved.value = true
        } catch (e) {
          error.value = e.message
        } finally {
          loading.value = false
        }
      }
      watch(submitted, () => {
        if (!loading.value && !saved.value) {
          savePlayer()
        }
      })

      watch(cleared, () => {
        if (saved.value) {
          emit('remove', player.value)
        }
      })

      return {
        loading,
        saved,
        error,
        contract,
        maxEndDate,
        team,
        isRequired: isRequired(),
        isNumber: isNumber(),
        inRange,
        positions,
        bonusRequirementTypes: [
          'Appearances',
          'Goals',
          'Assists',
          'Clean Sheets'
        ]
      }
    }
  }
</script>

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
        :rules="[isRequired]"
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
        :rules="[isRequired]"
        dense
        outlined
        hide-details
      />
    </td>
    <td>
      <v-select
        v-model="player.secPos"
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
        v-model.number="player.age"
        label="Age"
        :rules="[isRequired, isNumber]"
        dense
        outlined
        hide-details
        inputmode="numeric"
      />
    </td>
    <td>
      <v-text-field
        v-model.number="player.ovr"
        label="OVR"
        :rules="[isRequired, isNumber, inRange(null, [40, 100])]"
        dense
        outlined
        hide-details
        input="numeric"
      />
    </td>
    <td>
      <v-money-field
        v-model.number="player.value"
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
        v-model.number="player.kitNo"
        label="Kit Number"
        :rules="[isNumber, inRange(null, [1, 99])]"
        dense
        outlined
        hide-details
        inputmode="numeric"
      />
    </td>
    <td>
      <v-date-field
        v-model="contract.endedOn"
        label="Contract Ends"
        :min="contract.startedOn"
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
        v-model.number="contract.wage"
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
        v-model.number="contract.signingBonus"
        label="Signing Bonus"
        :prefix="team.currency"
        dense
        outlined
        hide-details
      />
    </td>
    <td>
      <v-money-field
        v-model.number="contract.releaseClause"
        label="Release Clause"
        :prefix="team.currency"
        dense
        outlined
        hide-details
      />
    </td>
    <td>
      <v-money-field
        v-model.number="contract.performanceBonus"
        label="Perf. Bonus"
        :prefix="team.currency"
        dense
        outlined
        hide-details
      />
    </td>
    <td>
      <v-text-field
        v-if="contract.performanceBonus"
        v-model.number="contract.bonusReq"
        label="Bonus Req."
        prefix="if"
        :rules="[isRequired, isNumber]"
        dense
        outlined
        hide-details
        inputmode="numeric"
      />
    </td>
    <td>
      <v-select
        v-if="contract.performanceBonus"
        v-model="contract.bonusReqType"
        label="Bonus Req. Type"
        :items="bonusRequirementTypes"
        :rules="[isRequired]"
        dense
        outlined
        hide-details
      />
    </td>
  </tr>
</template>

<style scoped>
  td:not(:first-child) {
    padding: 4px;
  }
  td >>> .v-input {
    width: 150px
  }
</style>
