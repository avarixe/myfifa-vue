<script>
  import { ref, computed, useStore } from '@nuxtjs/composition-api'
  import { nextTick } from 'vue'
  import { useTeam } from '@/composables'

  export default {
    name: 'MatchFilters',
    props: {
      filters: {
        type: Object,
        default: () => ({
          Season: null,
          Competition: null,
          Stage: null,
          Team: null,
          Result: null
        })
      }
    },
    setup (props) {
      const resetKey = ref(0)
      const filterType = ref(null)
      const filterValue = ref(null)
      const filterValueMenuOpen = ref(false)

      const { currentSeason, seasonLabel, teamId } = useTeam()
      const seasons = computed(() => {
        return [...Array(currentSeason.value + 1).keys()].reverse().map(i => ({
          value: i,
          text: seasonLabel(i)
        }))
      })

      const store = useStore()
      const filters = props.filters
      const competitions = computed(() => {
        return store.$db().model('Competition')
          .query()
          .where('teamId', parseInt(teamId.value))
          .where(comp => [null, comp.season].includes(filters.Season))
          .orderBy('season', 'desc')
          .get()
          .map(comp => comp.name)
      })

      const filterTypeOptions = computed(() =>
        Object.keys(filters).filter(filterType => filters[filterType] === null)
      )

      const filterValueOptions = computed(() => {
        switch (filterType.value) {
          case 'Season':
            return seasons.value
          case 'Competition':
            return [...new Set(competitions.value)]
          case 'Result':
            return ['Win', 'Draw', 'Loss']
          default:
            return []
        }
      })

      const filterValues = computed(() => {
        const values = {}
        for (const filter in filters) {
          const filterValue = filters[filter]
          if (filterValue !== null) {
            values[filter] = filter === 'Season'
              ? seasonLabel(filterValue)
              : filterValue
          }
        }
        return values
      })

      const filterValueSelect = ref(null)
      const filterValueField = ref(null)
      const openFilterValueField = async () => {
        await nextTick()
        if (filterValueOptions.value.length > 0) {
          filterValueSelect.value.activateMenu()
        } else {
          filterValueField.value.focus()
        }
      }

      const closeFilterValueField = () => {
        filterType.value = null
        resetKey.value++
      }

      const applyFilter = () => {
        filters[filterType.value] = filterValue.value
        filterValue.value = null
        filterType.value = null
      }

      return {
        resetKey,
        filterType,
        filterValue,
        filterValueMenuOpen,
        filterTypeOptions,
        filterValueOptions,
        filterValues,
        filterValueSelect,
        filterValueField,
        openFilterValueField,
        closeFilterValueField,
        applyFilter
      }
    }
  }
</script>

<template>
  <div :key="resetKey">
    <v-select
      v-if="!filterType"
      v-model="filterType"
      label="Filter"
      prepend-inner-icon="mdi-filter"
      :items="filterTypeOptions"
      @change="openFilterValueField"
    />
    <v-select
      v-else-if="filterValueOptions.length > 0"
      ref="filterValueSelect"
      v-model="filterValue"
      :label="`Filter by ${filterType}`"
      :items="filterValueOptions"
      prepend-inner-icon="mdi-filter"
      append-icon="mdi-backspace"
      @click:append="filterType = null"
      @change="applyFilter"
      @blur="closeFilterValueField"
    />
    <v-text-field
      v-else
      ref="filterValueField"
      v-model="filterValue"
      :label="`Filter by ${filterType}`"
      prepend-inner-icon="mdi-filter"
      append-icon="mdi-backspace"
      append-outer-icon="mdi-magnify"
      @click:append="filterType = null"
      @input="filters[filterType] = $event"
      @keydown.enter="applyFilter"
      @click:append-outer="applyFilter"
      @blur="closeFilterValueField"
    />
    <div class="mb-2">
      <v-chip
        v-for="filter in Object.keys(filterValues)"
        :key="filter"
        small
        close
        class="mr-1 mb-1"
        @click:close="filters[filter] = null"
      >
        {{ filter }}:&nbsp;<i>{{ filterValues[filter] }}</i>
      </v-chip>
    </div>
  </div>
</template>
