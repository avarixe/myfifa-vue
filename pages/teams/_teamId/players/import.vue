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
                disable-pagination
                disable-filtering
                hide-default-footer
                hide-default-header
              )
                template(#header)
                  thead
                    tr
                      th.stick-left
                      th Name
                      th Nationality
                      th Position
                      th Secondary Position(s)
                      th Age
                      th OVR
                      th Value
                      th Kit Number
                      th Contract Ends
                      th Wage
                      th Signing Bonus
                      th Release Clause
                      th(colspan=3) Performance Bonus
                template(#item="{ item }")
                  player-import-row(
                    :player="item"
                    @remove="removePlayer(item)"
                  )
            v-card-actions
              v-btn(
                type="submit"
                color="primary"
                text
                :disabled="!valid"
              ) Submit
</template>

<script>
  import { mapMutations } from 'vuex'
  import { TeamAccessible } from '@/mixins'
  import PlayerImportRow from '@/components/Player/ImportRow'

  export default {
    name: 'ImportPlayersPage',
    components: {
      PlayerImportRow
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
        { text: '', value: 'icon', class: 'stick-left' },
        { text: 'Name', value: 'name' },
        { text: 'Nationality', value: 'nationality' },
        { text: 'Position', value: 'pos' },
        { text: 'Secondary Position(s)', value: 'sec_pos' },
        { text: 'Age', value: 'age' },
        { text: 'OVR', value: 'ovr' },
        { text: 'Value', value: 'value' },
        { text: 'Kit Number', value: 'kit_no' },
        { text: 'Contract Ends', value: 'contract_ends' },
        { text: 'Wage', value: 'wage' },
        { text: 'Signing Bonus', value: 'signing_bonus' },
        { text: 'Release Clause', value: 'release_clause' },
        { text: 'Performance Bonus', value: 'performance_bonus' },
        { text: '', value: 'bonus_req' },
        { text: '', value: 'bonus_req_type' }

      ]
    }),
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
          birth_year: null,
          contracts_attributes: [
            {
              started_on: this.team.currently_on,
              ended_on: this.team.currently_on,
              wage: null,
              release_clause: null,
              performance_bonus: null,
              bonus_req: null,
              bonus_req_type: null
            }
          ]
        })
      },
      removePlayer (row) {
        this.players = this.players.filter(player => player !== row)
      }
    }
  }
</script>
