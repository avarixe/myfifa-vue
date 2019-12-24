<template lang="pug">
  v-container(fluid)
    v-row
      v-col(cols=12)
        v-btn(@click="addPlayer")
          v-icon(left) mdi-plus-circle-outline
          | Player
      v-col(cols=12)
        v-form(
          ref="form"
          v-model="valid"
          @submit.prevent
        )
        v-card
          v-card-text
            v-simple-table
              thead
                tr
                  th(v-for="field in fields" :key="field.value")
                    | {{ field.label }}
              tbody
                tr(v-for="(player, i) in players" :key="i")
                  td(v-for="field in fields" :key="field.value")
                    nationality-field.pa-1(
                      v-if="field.value === 'nationality'"
                      v-model="player.nationality"
                      :icon="null"
                      dense
                      outlined
                      hide-details
                    )
                    v-select.pa-1(
                      v-else-if="field.value === 'pos'"
                      v-model="player.pos"
                      :items="positions"
                      :rules="fieldRules(field)"
                      label="Position"
                      menu-props="auto"
                      dense
                      outlined
                      hide-details
                    )
                    v-select.pa-1(
                      v-else-if="field.value === 'sec_pos'"
                      v-model="player.sec_pos"
                      :items="positions"
                      label="Secondary Position(s)"
                      menu-props="auto, offsetY"
                      multiple
                      chips
                      deletable-chips
                      dense
                      outlined
                      hide-details
                    )
                    v-money-field.pa-1(
                      v-else-if="field.value === 'value'"
                      v-model="player.value"
                      label="Value"
                      required
                      dense
                      outlined
                      hide-details
                    )
                    v-text-field.pa-1(
                      v-else
                      v-model="player[field.value]"
                      :rules="fieldRules(field)"
                      :label="field.label"
                      dense
                      outlined
                      hide-details
                      :inputmode="field.inputmode"
                    )
</template>

<script>
  import { mapMutations } from 'vuex'
  import { positions } from '@/models/Player'
  import { TeamAccessible } from '@/mixins'
  import {
    NationalityField,
    VMoneyField,
    formatRule,
    rangeRule,
    requiredRule
  } from '@/helpers'

  export default {
    name: 'ImportPlayersPage',
    components: {
      NationalityField,
      VMoneyField
    },
    mixins: [
      TeamAccessible
    ],
    middleware: [
      'authenticated'
    ],
    transition: 'fade-transition',
    data: () => ({
      valid: false,
      players: [],
      fields: [
        {
          label: 'Name',
          value: 'name',
          required: true
        },
        {
          label: 'Nationality',
          value: 'nationality'
        },
        {
          label: 'Position',
          value: 'pos',
          required: true
        },
        {
          label: 'Secondary Position(s)',
          value: 'sec_pos'
        },
        {
          label: 'Age',
          value: 'age',
          inputmode: 'numeric',
          required: true
        },
        {
          label: 'OVR',
          value: 'ovr',
          inputmode: 'numeric',
          required: true,
          range: { min: 40, max: 100 }
        },
        {
          label: 'Value',
          value: 'value',
          inputmode: 'numeric',
          required: true
        },
        {
          label: 'Kit No',
          value: 'kit_no',
          inputmode: 'numeric',
          required: true,
          range: { min: 1, max: 99 }
        }
      ]
    }),
    computed: {
      positions () {
        return positions
      }
    },
    mounted () {
      this.setPage({
        title: 'Import Players',
        overline: this.team.title,
        headline: 'Import Players'
      })
    },
    methods: {
      ...mapMutations('app', {
        setPage: 'SET_PAGE'
      }),
      addPlayer () {
        this.players.push({
          name: '',
          pos: '',
          nationality: null,
          sec_pos: [],
          ovr: null,
          value: 0,
          kit_no: null,
          birth_year: null
        })
      },
      fieldRules ({ label, range, required, inputmode }) {
        let rules = []

        if (required) {
          rules.push(requiredRule({ label }))
        }

        if (inputmode === 'numeric') {
          rules.push(formatRule({ label, type: 'number' }))
        }

        if (range) {
          rules.push(rangeRule({ ...range, label }))
        }

        return rules
      }
    }
  }
</script>

<style scoped>
  td > * {
    width: 150px
  }
</style>
