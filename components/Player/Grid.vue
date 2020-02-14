<template lang="pug">
  v-card
    v-toolbar(flat)
      //- Display Menu
      v-tooltip(bottom :color="currentFilter.color")
        template(#activator="{ on: tooltip }")
          v-menu(bottom right)
            template(#activator="{ on: menu }")
              v-btn.px-1(text v-on="{ ...menu, ...tooltip }")
                v-icon(:color="currentFilter.color")
                  | mdi-{{ currentFilter.icon }}
            v-list
              v-list-item(
                v-for="(opt, i) in filters"
                :key="i"
                @click="filter = i"
              )
                v-list-item-avatar
                  v-icon(:color="opt.color") mdi-{{ opt.icon }}
                v-list-item-title {{ opt.text }}
        | Display {{ currentFilter.text }} Players
      v-btn-toggle.mx-3(
        v-model="mode"
        mandatory
        rounded
      )
        v-btn(v-for="(opt, i) in modes" :key="i" text)
          v-icon(:color="opt.color") mdi-{{ opt.icon }}
      .hidden-sm-and-down.subheading(:class="`${currentMode.color}--text`")
        | {{ currentMode.text }}
      v-spacer
      //- Player Search
      v-text-field(
        v-model="search"
        label="Search"
        append-icon="mdi-magnify"
        hide-details
      )
    //- Player Information Grid
    v-card-text
      client-only
        v-data-table(
          :key="key"
          :headers="headers"
          :items="rows"
          :loading="loading"
          sort-by="pos"
          must-sort
          :search="search"
          item-key="id"
          no-data-text="No Players Found"
        )
          template(#item.name="{ item }")
            v-btn(
              :to="item.link"
              small
              text
              nuxt
              color="info"
            )
              flag.mr-2(
                v-if="item.nationality"
                :iso="item.flag"
                :title="item.nationality"
              )
              | {{ item.name }}
          template(#item.kit_no="{ item }")
            inline-select(
              :item="item"
              attribute="kit_no"
              label="Kit No"
              :options="Array.from({ length: 98 }, (v, k) => k + 1)"
              dense
              @change="updatePlayerAttribute(item.id, 'kit_no', $event)"
            )
          template(#item.ovr="{ item }")
            inline-select(
              :item="item"
              attribute="ovr"
              label="OVR"
              :options="Array.from({ length: 61 }, (v, k) => k + 40)"
              dense
              @change="updatePlayerAttribute(item.id, 'ovr', $event)"
            )
          template(#item.value="{ item }")
            inline-field(
              :item="item"
              attribute="value"
              label="Value"
              input-type="money"
              :display="item.value | formatMoney(team.currency)"
              required
              @close="updatePlayerAttribute(item.id, 'value', $event)"
            )
          template(#item.status="{ item }")
            v-icon(:color="item.statusColor") mdi-{{ item.statusIcon }}
          template(#item.sec_pos="{ item }")
            | {{ item.sec_pos | listArray('-') }}
          template(#item.wage="{ item }")
            | {{ item.wage | formatMoney(team.currency, '-') }}
          template(#item.endDate="{ item }")
            | {{ item.endDate | formatDate('MMM dd, yyyy', '-') }}
</template>

<script>
  import { mapMutations, mapActions } from 'vuex'
  import { TeamAccessible } from '@/mixins'
  import { Player } from '@/models'
  import { positions } from '@/models/Player'

  export default {
    name: 'PlayerGrid',
    mixins: [
      TeamAccessible
    ],
    data: () => ({
      key: 0,
      mode: 0,
      modes: [
        { text: 'Overall', color: 'green', icon: 'trending-up' },
        { text: 'Edit', color: 'orange', icon: 'pencil' },
        { text: 'Contract', color: 'blue', icon: 'file-document-outline' },
        { text: 'Statistics', color: 'red', icon: 'numeric' }
      ],
      filter: 2,
      filters: [
        { text: 'All', color: 'blue', icon: 'earth' },
        { text: 'Youth', color: 'cyan', icon: 'school' },
        { text: 'Active', color: 'light-green', icon: 'account-check' },
        { text: 'Injured', color: 'pink', icon: 'ambulance' },
        { text: 'Loaned', color: 'indigo', icon: 'transit-transfer' },
        { text: 'Pending', color: 'deep-orange', icon: 'lock-clock' }
      ],
      search: '',
      loading: false,
      stats: {
        num_games: {},
        num_goals: {},
        num_assists: {},
        num_cs: {}
      }
    }),
    computed: {
      players () {
        return Player
          .query()
          .with('team|contracts')
          .where('team_id', parseInt(this.$route.params.teamId))
          .get()
      },
      currentMode () {
        return this.modes[this.mode]
      },
      currentFilter () {
        return this.filters[this.filter]
      },
      headers () {
        let headers = [
          { text: 'Name', value: 'name' },
          { text: 'Status', value: 'status', align: 'center', sortable: false, width: 40 },
          { text: 'Age', value: 'age', align: 'center' },
          { text: 'Position', value: 'pos', align: 'center', sort: this.sortPos },
          { text: 'Kit No', value: 'kit_no', align: 'center' }
        ]

        switch (this.mode) {
          case 0: // Overall
            return headers.concat([
              { text: '2nd Position(s)', value: 'sec_pos', sortable: false, align: 'center' },
              { text: 'OVR', value: 'ovr', align: 'center' },
              { text: 'Value', value: 'value', align: 'end' }
            ])
          case 1: // Edit
            return [
              { text: 'Name', value: 'name' },
              { text: 'Position', value: 'pos', align: 'center', sort: this.sortPos },
              { text: 'Kit No', value: 'kit_no', align: 'center' },
              { text: 'OVR', value: 'ovr', align: 'center' },
              { text: 'Value', value: 'value', align: 'end' }
            ]
          case 2: // Contract
            return headers.concat([
              { text: 'Value', value: 'value', align: 'end' },
              { text: 'Wage', value: 'wage', align: 'end' },
              { text: 'End Date', value: 'endDate', align: 'end' }
            ])
          case 3: // Statistics
            return headers.concat([
              { text: 'Games Played', value: 'numGames', align: 'center' },
              { text: 'Goals', value: 'numGoals', align: 'center' },
              { text: 'Assists', value: 'numAssists', align: 'center' },
              { text: 'Clean Sheets', value: 'numCs', align: 'center' }
            ])
          default:
            return headers
        }
      },
      rows () {
        return this.players
          .filter(player => {
            switch (this.filter) {
              case 0: // All
                return true
              case 1: // Youth
                return player.youth && player.contracts.length === 0
              case 2: // Active
                return player.status && player.status !== 'Pending'
              case 3: // Injured
              case 4: // Loaned
              case 5: // Pending
                return player.status === this.currentFilter.text
            }
          })
          .map(player => {
            const contract = player.contract()

            const numGames = this.stats.num_games[player.id] || 0
            const numGoals = this.stats.num_goals[player.id] || 0
            const numAssists = this.stats.num_assists[player.id] || 0
            const numCs = this.stats.num_cs[player.id] || 0

            return {
              ...player,
              flag: player.flag,
              link: player.link,
              statusIcon: player.statusIcon,
              statusColor: player.statusColor,

              wage: contract.wage,
              endDate: contract.ended_on,

              numGames,
              numGoals,
              numAssists,
              numCs
            }
          })
      }
    },
    watch: {
      mode (val) {
        val === 3 && this.getPlayerStats()
      }
    },
    methods: {
      ...mapMutations('broadcaster', {
        announce: 'ANNOUNCE'
      }),
      ...mapActions('players', {
        updatePlayer: 'UPDATE',
        analyzePlayers: 'ANALYZE'
      }),
      async getPlayerStats () {
        try {
          this.loading = true
          const { data } = await this.analyzePlayers({
            teamId: this.team.id,
            playerIds: this.players.map(player => player.id)
          })

          this.stats = data
        } catch (e) {
          console.error(e)
        } finally {
          this.loading = false
        }
      },
      async updatePlayerAttribute (playerId, attribute, value) {
        try {
          await this.updatePlayer({
            id: playerId,
            [attribute]: value
          })
        } catch (e) {
          this.key++
          this.announce({
            message: e.message,
            color: 'red'
          })
        }
      },
      sortPos (posA, posB) {
        return positions.indexOf(posA) - positions.indexOf(posB)
      }
    }
  }
</script>
