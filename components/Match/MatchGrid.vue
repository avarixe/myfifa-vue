<template>
  <v-card>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="items"
        item-key="id"
        :options.sync="options"
        :loading="loading"
        :server-items-length="serverItemsLength"
        must-sort
        no-data-text="No Matches Recorded"
        :mobile-breakpoint="0"
      >
        <template #top>
          <match-filters :filters.sync="filters" />
        </template>
        <template #item="{ item }">
          <tr>
            <td class="text-center">
              <div>{{ item.home }} v {{ item.away }}</div>
              <div :class="`${item.resultColor}--text`">{{ item.score }}</div>
            </td>
            <td class="text-center">
              <div>{{ item.competition }}</div>
              <i v-if="item.stage">{{ item.stage }}</i>
            </td>
            <td>{{ item.playedOn | formatDate }}</td>
            <td class="stick-right">
              <v-btn
                :to="item.link"
                nuxt
                block
                color="info"
              >
                <v-icon>mdi-play</v-icon>
              </v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
  import { gql } from 'nuxt-graphql-request'
  import { matchFragment } from '@/fragments'

  export default {
    name: 'MatchGrid',
    data: () => ({
      headers: [
        { text: 'Match', value: 'score', align: 'center', sortable: false, width: 250 },
        { text: 'Competition', value: 'competition', align: 'center', sortable: false, width: 250 },
        { text: 'Date Played', value: 'playedOn', width: 120 },
        { text: 'Link', value: 'link', align: 'center', class: 'stick-right', sortable: false, width: 40 }
      ],
      filters: {
        Season: null,
        Competition: null,
        Stage: null,
        Team: null,
        Result: null
      },

      // Server Side processing
      serverItemsLength: 0,
      timeout: null,
      loading: false,
      items: [],
      options: {
        sortBy: ['playedOn'],
        sortDesc: [true]
      }
    }),
    computed: {
      searchParams () {
        return {
          teamId: parseInt(this.$route.query.teamId),
          pagination: {
            page: this.options.page - 1,
            itemsPerPage: this.options.itemsPerPage,
            sortBy: this.options.sortBy[0],
            sortDesc: this.options.sortDesc[0]
          },
          filters: {
            season: this.filters.Season,
            competition: this.filters.Competition,
            stage: this.filters.Stage,
            team: this.filters.Team,
            result: this.filters.Result ? [this.filters.Result.toLowerCase()] : null
          }
        }
      }
    },
    watch: {
      searchParams: {
        immediate: true,
        deep: true,
        handler () {
          clearTimeout(this.timeout)
          this.timeout = setTimeout(this.fetchMatchesPage, 300)
        }
      }
    },
    beforeDestroy () {
      clearTimeout(this.timeout)
    },
    methods: {
      async fetchMatchesPage () {
        try {
          this.loading = true

          const query = gql`
            query fetchMatchesPage($teamId: ID!, $pagination: PaginationAttributes, $filters: MatchFilterAttributes) {
              team(id: $teamId) {
                matchSet(pagination: $pagination, filters: $filters) {
                  matches { ...MatchData }
                  total
                }
              }
            }
            ${matchFragment}
          `

          const { team: { matchSet } } =
            await this.$graphql.default.request(query, this.searchParams)

          await this.$store.$db().model('Match').insert({ data: matchSet.matches })
          this.items = this.$store.$db().model('Match')
            .query()
            .where('id', matchSet.matches.map(match => parseInt(match.id)))
            .get()
          this.serverItemsLength = matchSet.total
        } catch (e) {
          console.error(e)
        } finally {
          this.loading = false
        }
      }
    }
  }
</script>
