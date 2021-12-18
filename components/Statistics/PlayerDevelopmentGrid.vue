<script>
  import { ref, toRef, computed, useStore } from '@nuxtjs/composition-api'
  import groupBy from 'lodash.groupby'
  import { useTeam } from '@/composables'
  import { positions } from '@/constants'

  function sortPos (posA, posB) {
    return positions.indexOf(posA) - positions.indexOf(posB)
  }

  export default {
    name: 'PlayerDevelopmentGrid',
    props: {
      stats: { type: Array, required: true }
    },
    setup (props) {
      const key = ref(0)

      const filter = ref(2)
      const filters = [
        { text: 'All', color: 'blue', icon: 'earth' },
        { text: 'Youth', color: 'cyan', icon: 'school' },
        { text: 'Active', color: 'light-green', icon: 'account-check' }
      ]
      const currentFilter = computed(() => filters[filter.value])

      const metric = ref(0)
      const metrics = [
        { text: 'OVR', value: 'ovr', color: 'green', icon: 'trending-up' },
        { text: 'Value', value: 'value', color: 'red', icon: 'cash-multiple' }
      ]
      const currentMetric = computed(() => metrics[metric.value])

      const sortDesc = ref(false)
      const sortNullLast = (a, b) => {
        if (a === b) {
          return 0
        } else if (a === undefined) {
          return sortDesc.value ? -1 : 1
        } else if (b === undefined) {
          return sortDesc.value ? 1 : -1
        } else {
          return a < b ? -1 : 1
        }
      }

      const { team, seasonLabel, currentSeason } = useTeam()
      const headers = computed(() => {
        const headers = [
          { text: 'Name', value: 'name', width: 200, class: 'stick-left' },
          { text: 'Nationality', value: 'nationality', align: 'center', width: 120 },
          { text: 'Pos', value: 'pos', align: 'center', width: 100, sort: sortPos },
          {
            text: `Start ${currentMetric.value.text}`,
            value: `start${currentMetric.value.value}`,
            align: 'end',
            class: 'text-right',
            width: 120
          }
        ]

        for (let i = 0; i <= currentSeason.value; i++) {
          headers.push({
            text: seasonLabel(i),
            value: `${currentMetric.value.value}Diff.${i}`,
            align: 'end',
            class: 'text-right',
            width: 120,
            sort: sortNullLast
          })
        }

        headers.push({
          text: `Last ${currentMetric.value.text}`,
          value: currentMetric.value.value,
          align: 'end',
          class: 'text-right',
          width: 120
        })

        return headers
      })

      const stats = toRef(props, 'stats')
      const statsByPlayerId = computed(() => groupBy(stats.value, 'playerId'))

      const store = useStore()
      const players = computed(() =>
        store.$db().model('Player').query().where('teamId', team.value.id).get()
      )
      const rows = computed(() => {
        return players.value.filter(player => {
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
          const playerWithStats = {
            ...player,
            flag: player.flag
          }

          const stats = statsByPlayerId.value[player.id]
          const ovrDiff = {}
          const valueDiff = {}
          if (stats) {
            stats.forEach(stat => {
              ovrDiff[stat.season] = stat.ovr[1] - stat.ovr[0]
              valueDiff[stat.season] = (stat.value[1] - stat.value[0]) / stat.value[0] * 100
            })
            playerWithStats.startovr = stats[0].ovr[0]
            playerWithStats.startValue = stats[0].value[0]
          }
          playerWithStats.ovrDiff = ovrDiff
          playerWithStats.valueDiff = valueDiff

          return playerWithStats
        })
      })

      const ovrColor = ovrDiff => {
        switch (true) {
          case ovrDiff > 6:
            return 'green--text text--darken-2'
          case ovrDiff > 4:
            return 'green--text'
          case ovrDiff > 2:
            return 'light-green--text text--darken-2'
          case ovrDiff > 0:
            return 'light-green--text'
          case ovrDiff < -2:
            return 'red--text'
          case ovrDiff < 0:
            return 'orange--text'
          default:
            return 'grey--text'
        }
      }

      const valueColor = valueDiff => {
        switch (true) {
          case valueDiff > 100:
            return 'green--text text--darken-2'
          case valueDiff > 50:
            return 'green--text'
          case valueDiff > 25:
            return 'light-green--text text--darken-2'
          case valueDiff > 0:
            return 'light-green--text'
          case valueDiff < -25:
            return 'red--text'
          case valueDiff < 0:
            return 'orange--text'
          default:
            return 'grey--text'
        }
      }

      return {
        key,
        filter,
        filters,
        currentFilter,
        metric,
        metrics,
        currentMetric,
        sortDesc,
        headers,
        rows,
        team,
        currentSeason,
        ovrColor,
        valueColor
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

      <v-menu>
        <template #activator="{ on }">
          <v-btn
            class="px-3"
            text
            v-on="on"
          >
            <v-icon
              left
              :color="currentMetric.color"
            >
              mdi-{{ currentMetric.icon }}
            </v-icon>
            <div :class="`text-capitalize ${currentMetric.color}--text`">
              {{ currentMetric.text }}
            </div>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(opt, i) in metrics"
            :key="i"
            @click="metric = i"
          >
            <v-list-item-avatar>
              <v-icon :color="opt.color">mdi-{{ opt.icon }}</v-icon>
            </v-list-item-avatar>
            <v-list-item-title>{{ opt.text }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-toolbar>

    <!-- Player Information Grid -->
    <v-card-text>
      <v-data-table
        :key="key"
        :headers="headers"
        :items="rows"
        item-key="id"
        sort-by="pos"
        :sort-desc.sync="sortDesc"
        must-sort
        no-data-text="No Players Found"
        :mobile-breakpoint="0"
      >
        <template #item="{ item }">
          <tr>
            <td class="stick-left">
              <v-btn
                :to="`/teams/${team.id}/players/${item.id}`"
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
            <td class="text-center">{{ item.pos }}</td>
            <template v-if="metric === 0">
              <td class="text-right">{{ item.startovr }}</td>
              <td
                v-for="(_, season) in new Array(currentSeason + 1)"
                :key="season"
                :class="`text-right ${ovrColor(item.ovrDiff[season])}`"
              >
                {{ item.ovrDiff[season] > 0 ? '+' : '' }}
                {{ item.ovrDiff[season] }}
              </td>
              <td class="text-right">{{ item.ovr }}</td>
            </template>
            <template v-else>
              <td class="text-right">
                {{ item.startValue | formatMoney(team.currency) }}
              </td>
              <td
                v-for="(_, season) in new Array(currentSeason + 1)"
                :key="season"
                :class="`text-right ${valueColor(item.valueDiff[season])}`"
              >
                <span v-if="item.valueDiff[season] !== undefined">
                  {{ item.valueDiff[season] > 0 ? '+' : '' }}
                  {{ item.valueDiff[season].toFixed(2) }}%
                </span>
              </td>
              <td class="text-right">
                {{ item.value | formatMoney(team.currency) }}
              </td>
            </template>
          </tr>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>
