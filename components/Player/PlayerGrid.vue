<template>
  <v-card>
    <v-toolbar flat>
      <!-- Display Menu -->
      <v-tooltip
        bottom
        :color="currentFilter.color"
      >
        <template #activator="{ on: tooltip }">
          <v-menu
            bottom
            right
          >
            <template #activator="{ on: menu }">
              <v-btn
                class="px-1"
                text
                v-on="{ ...menu, ...tooltip }"
              >
                <v-icon :color="currentFilter.color">
                  mdi-{{ currentFilter.icon }}
                </v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="(opt, i) in filters"
                :key="i"
                @click="filter = i"
              >
                <v-list-item-avatar>
                  <v-icon :color="opt.color">mdi-{{ opt.icon }}</v-icon>
                </v-list-item-avatar>
                <v-list-item-title>{{ opt.text }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
        Display {{ currentFilter.text }} Players
      </v-tooltip>
      <v-btn-toggle
        v-model="mode"
        mandatory
        rounded
        class="mx-3"
      >
        <v-btn
          v-for="(opt, i) in modes"
          :key="i"
          text
        >
          <v-icon :color="opt.color">mdi-{{ opt.icon }}</v-icon>
        </v-btn>
      </v-btn-toggle>
      <div :class="`hidden-sm-and-down subheading ${currentMode.color}--text`">
        {{ currentMode.text }}
      </div>
      <v-spacer />
      <v-text-field
        v-model="search"
        label="Search"
        append-icon="mdi-magnify"
        hide-details
      />
    </v-toolbar>

    <!-- Player Information Grid -->
    <v-card-text>
      <client-only>
        <v-data-table
          :key="key"
          :headers="headers"
          :items="rows"
          :loading="loading"
          sort-by="pos"
          must-sort
          :search="search"
          item-key="id"
          no-data-text="No Players Found"
        >
          <template #item.name="{ item }">
            <v-btn
              :to="item.link"
              small
              text
              nuxt
              color="info"
              class="text-capitalize"
            >
              <flag
                v-if="item.flag"
                :iso="item.flag"
                :title="item.nationality"
                class="mr-2"
              />
              {{ item.name }}
            </v-btn>
          </template>
          <template #item.kitNo="{ item }">
            <inline-select
              :item="item"
              attribute="kitNo"
              label="Kit No"
              :options="Array.from({ length: 98 }, (v, k) => k + 1)"
              dense
              @change="updatePlayerAttribute(item.id, 'kitNo', $event)"
            />
          </template>
          <template #item.ovr="{ item }">
            <inline-select
              :item="item"
              attribute="ovr"
              label="OVR"
              :options="Array.from({ length: 61 }, (v, k) => k + 40)"
              dense
              @change="updatePlayerAttribute(item.id, 'ovr', $event)"
            />
          </template>
          <template #item.value="{ item }">
            <inline-field
              :item="item"
              attribute="value"
              label="Value"
              input-type="money"
              :display="item.value | formatMoney(team.currency)"
              required
              @close="updatePlayerAttribute(item.id, 'value', $event)"
            />
          </template>
          <template #item.status="{ item }">
            <v-icon :color="item.statusColor">mdi-{{ item.statusIcon }}</v-icon>
          </template>
          <template #item.secPos="{ item }">
            {{ item.secPos | listArray('-') }}
          </template>
          <template #item.wage="{ item }">
            {{ item.wage | formatMoney(team.currency, '-') }}
          </template>
          <template #item.endDate="{ item }">
            {{ item.endDate | formatDate('MMM dd, yyyy', '-') }}
          </template>
        </v-data-table>
      </client-only>
    </v-card-text>
  </v-card>
</template>

<script>
  import { mapMutations, mapActions } from 'vuex'
  import { TeamAccessible } from '@/mixins'
  import { positions } from '@/constants'

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
        { text: 'Contract', color: 'blue', icon: 'file-document-outline' }
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
      loading: false
    }),
    computed: {
      players () {
        return this.$store.$db().model('Player')
          .query()
          .with('team|contracts')
          .where('teamId', parseInt(this.$route.params.teamId))
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
          { text: 'Kit No', value: 'kitNo', align: 'center' }
        ]

        switch (this.mode) {
          case 0: // Overall
            return headers.concat([
              { text: '2nd Position(s)', value: 'secPos', sortable: false, align: 'center' },
              { text: 'OVR', value: 'ovr', align: 'center' },
              { text: 'Value', value: 'value', align: 'end' }
            ])
          case 1: // Edit
            return [
              { text: 'Name', value: 'name' },
              { text: 'Position', value: 'pos', align: 'center', sort: this.sortPos },
              { text: 'Kit No', value: 'kitNo', align: 'center' },
              { text: 'OVR', value: 'ovr', align: 'center' },
              { text: 'Value', value: 'value', align: 'end' }
            ]
          case 2: // Contract
            return headers.concat([
              { text: 'Value', value: 'value', align: 'end' },
              { text: 'Wage', value: 'wage', align: 'end' },
              { text: 'End Date', value: 'endDate', align: 'end' }
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
            return {
              ...player,
              flag: player.flag,
              link: player.link,
              statusIcon: player.statusIcon,
              statusColor: player.statusColor,

              wage: contract.wage,
              endDate: contract.endedOn
            }
          })
      }
    },
    methods: {
      ...mapMutations('broadcaster', [
        'announce'
      ]),
      ...mapActions('players', {
        updatePlayer: 'update'
      }),
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
