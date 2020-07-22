<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-btn
          class="ma-1"
          @click="addPlayer"
        >
          <v-icon left>mdi-plus-circle-outline</v-icon>
          Player
        </v-btn>
        <input
          ref="uploader"
          type="file"
          accept=".xlsx"
          class="d-none"
          @input="upload"
        >
        <v-btn
          class="ma-1"
          to="/import_players_template.xlsx"
          target="_blank"
        >
          Download Template
        </v-btn>
        <v-btn
          class="ma-1"
          @click="$refs.uploader.click()"
        >
          Upload File
        </v-btn>
      </v-col>
      <v-col cols="12">
        <v-form
          ref="form"
          v-model="valid"
          @submit.prevent="submitted++"
        >
          <v-card>
            <v-card-text>
              <v-simple-table
                fixed-header
                height="50vh"
              >
                <thead>
                  <tr>
                    <th />
                    <th>Name</th>
                    <th>Nationality</th>
                    <th>Position</th>
                    <th>Secondary Position(s)</th>
                    <th>Age</th>
                    <th>OVR</th>
                    <th>Value</th>
                    <th>Kit Number</th>
                    <th>Contract Ends</th>
                    <th>Wage</th>
                    <th>Signing Bonus</th>
                    <th>Release Clause</th>
                    <th colspan="3">Performance Bonus</th>
                  </tr>
                </thead>
                <tbody>
                  <player-import-row
                    v-for="player in players"
                    :key="player.rowId"
                    :player="player"
                    :submitted="submitted"
                    :cleared="cleared"
                    @remove="removePlayer(player)"
                  />
                </tbody>
              </v-simple-table>
            </v-card-text>
            <v-card-actions>
              <v-btn
                type="submit"
                :disabled="!valid || players.length === 0"
                color="primary"
                text
              >
                Submit
              </v-btn>
              <v-btn
                color="success"
                :disabled="cleared >= submitted"
                text
                @click="cleared++"
              >
                Clear Saved Players
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { mapMutations } from 'vuex'
  import XLSX from 'xlsx/dist/xlsx.mini.min'
  import { format } from 'date-fns'
  import { TeamAccessible } from '@/mixins'

  export default {
    name: 'ImportPlayersPage',
    mixins: [
      TeamAccessible
    ],
    middleware: [
      'authenticated'
    ],
    transition: 'fade-transition',
    data: () => ({
      valid: false,
      numPlayers: 0,
      submitted: 0,
      cleared: 0,
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
          rowId: this.numPlayers++,
          name: '',
          pos: '',
          nationality: null,
          sec_pos: [],
          ovr: null,
          value: 0,
          kit_no: null,
          age: null,
          contracts_attributes: [
            {
              started_on: this.team.currently_on,
              ended_on: this.team.currently_on,
              wage: null,
              release_clause: null,
              signing_bonus: null,
              performance_bonus: null,
              bonus_req: null,
              bonus_req_type: null
            }
          ]
        })
      },
      removePlayer (row) {
        this.players = this.players.filter(player => player.rowId !== row.rowId)
      },
      upload (event) {
        /* Boilerplate to set up FileReader */
        const reader = new FileReader()
        reader.onload = (e) => {
          /* Parse data */
          const bstr = e.target.result
          const wb = XLSX.read(bstr, { type: 'binary', cellDates: true })
          /* Get first worksheet */
          const wsname = wb.SheetNames[0]
          const ws = wb.Sheets[wsname]
          /* Convert array of arrays */
          const data = XLSX.utils.sheet_to_json(ws)
          /* Update state */
          data.forEach(player => this.importPlayer(player))
        }

        const files = event.target.files

        if (files && files.length > 0) {
          reader.readAsBinaryString(files[0])
        }

        this.$refs.uploader.value = null
      },
      importPlayer (player) {
        this.players.push({
          rowId: this.numPlayers++,
          name: player['Name'],
          pos: player['Position'],
          nationality: player['Nationality'],
          sec_pos: player['Secondary Position(s)'] &&
            player['Secondary Position(s)'].split(','),
          ovr: player['OVR'],
          value: player['Value'],
          kit_no: player['Kit Number'],
          age: player['Age'],
          contracts_attributes: [
            {
              started_on: this.team.currently_on,
              ended_on: format(player['Contract Ends'], 'yyyy-MM-dd'),
              wage: player['Wage'],
              release_clause: player['Release Clause'],
              signing_bonus: player['Signing Bonus'],
              performance_bonus: player['Performance Bonus'],
              bonus_req: player['Bonus Req'],
              bonus_req_type: player['Bonus Req. Type']
            }
          ]
        })
      }
    }
  }
</script>
