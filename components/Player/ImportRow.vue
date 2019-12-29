<template lang="pug">
  tr
    td.stick-left.pa-1
      v-btn(
        v-if="saved"
        text
        @click="$emit('remove', player)"
      )
        v-icon(color="success") mdi-check-circle
      v-tooltip(
        v-else-if="error.length > 0"
        color="red"
        right
      )
        template(#activator="{ on }")
          v-btn(
            text
            v-on="on"
            @click="error = ''"
          )
            v-icon(color="red") mdi-alert
        v-icon(left dark) mdi-alert
        | {{ error }}
      v-btn(
        v-else
        text
        :loading="loading"
        @click="$emit('remove', player)"
      )
        v-icon mdi-close
    td.pa-1(v-for="field in fields" :key="field.value" style="width:150px")
      dynamic-field(
        :object="player"
        :field="field"
      )
        template(#field.nationality)
          nationality-field(
            v-model="player.nationality"
            :icon="null"
            dense
            outlined
            hide-details
          )
</template>

<script>
  import { mapActions } from 'vuex'
  import { addYears, format, parseISO } from 'date-fns'
  import { Team } from '@/models'
  import { positions } from '@/models/Player'
  import { DynamicField, NationalityField } from '@/helpers'

  const bonusRequirementTypes = [
    'Appearances',
    'Goals',
    'Assists',
    'Clean Sheets'
  ]

  export default {
    name: 'PlayerImportRow',
    components: {
      DynamicField,
      NationalityField
    },
    props: {
      player: {
        type: Object,
        required: true
      },
      submitted: {
        type: Number,
        default: 0
      },
      cleared: {
        type: Number,
        default: 0
      }
    },
    data: () => ({
      loading: false,
      saved: false,
      error: ''
    }),
    computed: {
      team () {
        return Team.find(this.$route.params.teamId)
      },
      contract () {
        return this.player.contracts_attributes[0]
      },
      fields () {
        return [
          {
            type: 'string',
            attribute: 'name',
            label: 'Name',
            required: true,
            dense: true,
            outlined: true,
            hideDetails: true,
            spellcheck: 'false',
            autocapitalize: 'words',
            autocomplete: 'off',
            autocorrect: 'off'
          },
          { slot: 'nationality' },
          {
            type: 'select',
            attribute: 'pos',
            label: 'Position',
            items: positions,
            required: true,
            dense: true,
            outlined: true,
            hideDetails: true
          },
          {
            type: 'select',
            attribute: 'sec_pos',
            label: '2nd Position(s)',
            items: positions,
            multiple: true,
            dense: true,
            outlined: true,
            hideDetails: true
          },
          {
            type: 'string',
            attribute: 'age',
            label: 'Age',
            required: true,
            dense: true,
            outlined: true,
            hideDetails: true,
            inputmode: 'numeric'
          },
          {
            type: 'string',
            attribute: 'ovr',
            label: 'OVR',
            required: true,
            dense: true,
            outlined: true,
            hideDetails: true,
            inputmode: 'numeric',
            range: { min: 40, max: 100 }
          },
          {
            type: 'money',
            attribute: 'value',
            label: 'Value',
            prefix: this.team.currency,
            required: true,
            dense: true,
            outlined: true,
            hideDetails: true
          },
          {
            type: 'string',
            attribute: 'kit_no',
            label: 'Kit Number',
            dense: true,
            outlined: true,
            hideDetails: true,
            inputmode: 'numeric',
            range: { min: 1, max: 99 }
          },
          {
            type: 'date',
            object: this.contract,
            attribute: 'ended_on',
            label: 'Contract Ends',
            min: this.contract.started_on,
            max: this.maxEndDate(this.contract),
            required: true,
            dense: true,
            outlined: true,
            hideDetails: true,
            startWithYear: true
          },
          {
            type: 'money',
            object: this.contract,
            attribute: 'wage',
            label: 'Wage',
            prefix: this.team.currency,
            required: true,
            dense: true,
            outlined: true,
            hideDetails: true
          },
          {
            type: 'money',
            object: this.contract,
            attribute: 'signing_bonus',
            label: 'Signing Bonus',
            prefix: this.team.currency,
            dense: true,
            outlined: true,
            hideDetails: true
          },
          {
            type: 'money',
            object: this.contract,
            attribute: 'release_clause',
            label: 'Release Clause',
            prefix: this.team.currency,
            dense: true,
            outlined: true,
            hideDetails: true
          },
          {
            type: 'money',
            object: this.contract,
            attribute: 'performance_bonus',
            label: 'Perf. Bonus',
            prefix: this.team.currency,
            dense: true,
            outlined: true,
            hideDetails: true
          },
          {
            type: 'string',
            object: this.contract,
            attribute: 'bonus_req',
            label: 'Bonus Req.',
            prefix: 'if',
            required: true,
            dense: true,
            outlined: true,
            hideDetails: true,
            inputmode: 'numeric',
            hidden: !this.contract.performance_bonus
          },
          {
            type: 'select',
            object: this.contract,
            attribute: 'bonus_req_type',
            label: 'Bonus Req. Type',
            items: bonusRequirementTypes,
            required: true,
            clearable: true,
            dense: true,
            outlined: true,
            hideDetails: true,
            hidden: !this.contract.performance_bonus
          }
        ]
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
      },
      maxEndDate (contract) {
        return contract.started_on && format(
          addYears(parseISO(contract.started_on), 6),
          'yyyy-MM-dd'
        )
      }
    }
  }
</script>

<style scoped>
  td >>> .v-input {
    width: 150px
  }
</style>
