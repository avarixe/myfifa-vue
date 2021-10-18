<script>
  import { ref, computed, useStore } from '@nuxtjs/composition-api'
  import { useTeam } from '@/composables'
  import { positions } from '@/constants'

  export default {
    name: 'PlayerGrid',
    setup () {
      const store = useStore()
      const { team } = useTeam()

      const players = computed(() =>
        store.$db().model('Player')
          .query()
          .with('team|contracts')
          .where('teamId', parseInt(team.value.id))
          .get()
      )

      const filters = [
        { text: 'All', color: 'blue', icon: 'earth' },
        { text: 'Youth', color: 'cyan', icon: 'school' },
        { text: 'Active', color: 'light-green', icon: 'account-check' },
        { text: 'Injured', color: 'pink', icon: 'ambulance' },
        { text: 'Loaned', color: 'deep-orange', icon: 'transit-transfer' },
        { text: 'Pending', color: 'orange', icon: 'lock-clock' }
      ]
      const filter = ref(2)
      const currentFilter = computed(() => filters[filter.value])

      const rows = computed(() =>
        players.value.filter(player => {
          switch (filter.value) {
            case 0: // All
              return true
            case 1: // Youth
              return player.youth
            case 2: // Active
              return player.status && player.status !== 'Pending'
            case 3: // Injured
            case 4: // Loaned
            case 5: // Pending
              return player.status === currentFilter.value.text
          }
        }).map(player => {
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
      )

      const key = ref(0)
      const updatePlayerAttribute = async (playerId, attribute, value) => {
        try {
          await store.dispatch('players/update', {
            id: playerId,
            attributes: { [attribute]: value }
          })
        } catch (e) {
          key.value++
          store.commit('broadcaster/announce', {
            message: e.message,
            color: 'red'
          })
        }
      }

      const search = ref('')
      const loading = ref(false)

      const sortPos = (posA, posB) => {
        return positions.indexOf(posA) - positions.indexOf(posB)
      }
      return {
        key,
        filter,
        search,
        loading,
        currentFilter,
        rows,
        updatePlayerAttribute,
        team,
        headers: [
          { text: 'Name', value: 'name', width: 200, class: 'stick-left' },
          { text: 'Nationality', value: 'nationality', align: 'center', width: 120 },
          { text: 'Status', value: 'status', align: 'center', width: 100 },
          { text: 'Age', value: 'age', align: 'center', width: 100 },
          { text: 'Pos', value: 'pos', align: 'center', width: 100, sort: sortPos },
          { text: '2nd Pos', value: 'secPos', sortable: false, align: 'center', width: 100 },
          { text: 'Kit No', value: 'kitNo', align: 'center', width: 100 },
          { text: 'OVR', value: 'ovr', align: 'center', width: 80 },
          { text: 'Value', value: 'value', align: 'end', width: 100, class: 'text-right' },
          { text: 'Wage', value: 'wage', align: 'end', width: 100, class: 'text-right' },
          { text: 'Contracts Ends', value: 'endDate', align: 'end', width: 120, class: 'text-right' }
        ],
        filters
      }
    }
  }
</script>

<template>
  <v-card>
    <v-toolbar flat>
      <v-menu>
        <template #activator="{ on }">
          <v-btn
            class="px-3"
            text
            v-on="on"
          >
            <v-icon
              left
              :color="currentFilter.color"
            >
              mdi-{{ currentFilter.icon }}
            </v-icon>
            <div :class="`text-capitalize ${currentFilter.color}--text`">
              {{ currentFilter.text }} Players
            </div>
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
        <template #item="{ item }">
          <tr>
            <td class="stick-left">
              <v-btn
                :to="item.link"
                small
                text
                nuxt
                color="info"
                class="text-capitalize"
              >
                {{ item.name }}
              </v-btn>
            </td>
            <td class="text-center">
              <flag
                :iso="item.flag"
                :title="item.nationality"
                class="mr-2"
              />
            </td>
            <td class="text-center">
              <v-icon :color="item.statusColor">
                mdi-{{ item.statusIcon }}
              </v-icon>
            </td>
            <td class="text-center">{{ item.age }}</td>
            <td class="text-center">{{ item.pos }}</td>
            <td class="text-center">{{ item.secPos | listArray(' ') }}</td>
            <td class="text-center">
              <inline-select
                :item="item"
                attribute="kitNo"
                label="Kit No"
                :options="Array.from({ length: 98 }, (v, k) => k + 1)"
                dense
                @change="updatePlayerAttribute(item.id, 'kitNo', $event)"
              />
            </td>
            <td class="text-center">
              <inline-select
                :item="item"
                attribute="ovr"
                label="OVR"
                :options="Array.from({ length: 61 }, (v, k) => k + 40)"
                dense
                @change="updatePlayerAttribute(item.id, 'ovr', $event)"
              />
            </td>
            <td class="text-right">
              <inline-field
                :item="item"
                attribute="value"
                label="Value"
                input-type="money"
                :display="item.value | formatMoney(team.currency)"
                required
                @close="updatePlayerAttribute(item.id, 'value', $event)"
              />
            </td>
            <td class="text-right">
              {{ item.wage | formatMoney(team.currency, '-') }}
            </td>
            <td class="text-right">
              {{ item.endDate | formatDate('MMM dd, yyyy', '-') }}
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>
