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
              tbody
                player-import-row(
                  v-for="(player, i) in players"
                  :key="i"
                  :player="player"
                  :fields="fields"
                )
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
      players: []
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
      }
    }
  }
</script>
