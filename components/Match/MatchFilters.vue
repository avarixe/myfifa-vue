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

<script>
  import { TeamAccessible } from '@/mixins'

  export default {
    name: 'MatchFilters',
    mixins: [
      TeamAccessible
    ],
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
    data: () => ({
      resetKey: 0,
      filterType: null,
      filterValue: null,
      filterValueMenuOpen: false
    }),
    computed: {
      seasons () {
        return [...Array(this.season + 1).keys()].reverse().map(i => ({
          value: i,
          text: this.seasonLabel(i)
        }))
      },
      competitions () {
        return this.$store.$db().model('Competition')
          .query()
          .where('teamId', this.team.id)
          .where(comp => [null, comp.season].includes(this.filters.Season))
          .orderBy('season', 'desc')
          .get()
          .map(comp => comp.name)
      },
      filterTypeOptions () {
        return Object.keys(this.filters)
          .filter(filterType => this.filters[filterType] === null)
      },
      filterValueOptions () {
        switch (this.filterType) {
          case 'Season':
            return this.seasons
          case 'Competition':
            return [...new Set(this.competitions)]
          case 'Result':
            return ['Win', 'Draw', 'Loss']
          default:
            return []
        }
      },
      filterValues () {
        const values = {}
        for (const filter in this.filters) {
          const filterValue = this.filters[filter]
          if (filterValue !== null) {
            values[filter] = filter === 'Season'
              ? this.seasonLabel(filterValue)
              : filterValue
          }
        }
        return values
      }
    },
    methods: {
      openFilterValueField () {
        this.$nextTick(() => {
          if (this.filterValueOptions.length > 0) {
            this.$refs.filterValueSelect.activateMenu()
          } else {
            this.$refs.filterValueField.focus()
          }
        })
      },
      closeFilterValueField () {
        this.filterType = null
        this.resetKey++
      },
      applyFilter () {
        this.filters[this.filterType] = this.filterValue
        this.filterValue = null
        this.filterType = null
      }
    }
  }
</script>
