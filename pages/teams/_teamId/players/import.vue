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
            v-data-table(
              :headers="headers"
              :items="players"
              disable-sort
            )
              template(#item.name="{ item }")
                v-text-field.pa-1(
                  v-model="item.name"
                  :rules="fieldIsRequired('Name')"
                  dense
                  outlined
                  hide-details
                )
              template(#item.nationality="{ item }")
                nationality-field.pa-1(
                  v-model="item.nationality"
                  :label="null"
                  :icon="null"
                  dense
                  outlined
                  hide-details
                )
              template(#item.pos="{ item }")
                v-select.pa-1(
                  v-model="item.pos"
                  :items="positions"
                  :rules="fieldIsRequired('Position')"
                  menu-props="auto"
                  dense
                  outlined
                  hide-details
                )
              template(#item.sec_pos="{ item }")
                v-select.pa-1(
                  v-model="item.sec_pos"
                  :items="positions"
                  menu-props="auto, offsetY"
                  multiple
                  chips
                  deletable-chips
                  dense
                  outlined
                  hide-details
                )
              template(#item.age="{ item }")
                v-text-field.pa-1(
                  v-model="item.age"
                  :rules="fieldIsRequired('Age')"
                  dense
                  outlined
                  hide-details
                  inputmode="numeric"
                )
              template(#item.ovr="{ item }")
                v-text-field.pa-1(
                  v-model="item.ovr"
                  :rules="fieldIsRequired('OVR')"
                  dense
                  outlined
                  hide-details
                  inputmode="numeric"
                )
              template(#item.value="{ item }")
                v-money-field.pa-1(
                  v-model="item.value"
                  required
                  dense
                  outlined
                  hide-details
                )
              template(#item.kit_no="{ item }")
                v-text-field.pa-1(
                  v-model="item.kit_no"
                  :rules="fieldIsRequired('Kit No')"
                  dense
                  outlined
                  hide-details
                  inputmode="numeric"
                )
</template>

<script>
  import { mapMutations } from 'vuex'
  import { positions } from '@/models/Player'
  import { TeamAccessible } from '@/mixins'
  import {
    NationalityField,
    VMoneyField,
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
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Nationality', value: 'nationality' },
        { text: 'Position', value: 'pos' },
        { text: 'Secondary Position(s)', value: 'sec_pos' },
        { text: 'Age', value: 'age' },
        { text: 'OVR', value: 'ovr' },
        { text: 'Value', value: 'value' },
        { text: 'Kit No', value: 'kit_no' }
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
          ovr: 60,
          value: '',
          kit_no: null,
          birth_year: null
        })
      },
      fieldIsRequired (label) {
        return [requiredRule({ label })]
      }
    }
  }
</script>
