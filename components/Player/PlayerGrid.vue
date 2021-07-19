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
      <div :class="`hidden-sm-and-down subheading ${currentFilter.color}--text`">
        {{ currentFilter.text }} Players
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
          :mobile-breakpoint="0"
        >
          <template #item.name="{ item }">
            <v-btn
              :to="item.link"
              small
              text
              nuxt
              color="info"
              class="text-capitalize"
              v-text="item.name"
            />
          </template>
          <template #item.nationality="{ item }">
            <flag
              v-if="item.flag"
              :iso="item.flag"
              :title="item.nationality"
              class="mr-2"
            />
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
            {{ item.secPos | listArray(' ') }}
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

  function sortPos (posA, posB) {
    return positions.indexOf(posA) - positions.indexOf(posB)
  }

  export default {
    name: 'PlayerGrid',
    mixins: [
      TeamAccessible
    ],
    data: () => ({
      key: 0,
      headers: [
        { text: 'Name', value: 'name', width: 200, class: 'stick-left', cellClass: 'stick-left' },
        { text: 'Nationality', value: 'nationality', align: 'center', width: 120 },
        { text: 'Status', value: 'status', align: 'center', width: 100 },
        { text: 'Age', value: 'age', align: 'center', width: 100 },
        { text: 'Pos', value: 'pos', align: 'center', width: 100, sort: sortPos },
        { text: '2nd Pos', value: 'secPos', sortable: false, align: 'center', width: 100 },
        { text: 'Kit No', value: 'kitNo', align: 'center', width: 100 },
        { text: 'OVR', value: 'ovr', align: 'center', width: 80 },
        { text: 'Value', value: 'value', align: 'end', width: 100 },
        { text: 'Wage', value: 'wage', align: 'end', width: 100 },
        { text: 'Contracts Ends', value: 'endDate', align: 'end', width: 120 }
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
      currentFilter () {
        return this.filters[this.filter]
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
      }
    }
  }
</script>
