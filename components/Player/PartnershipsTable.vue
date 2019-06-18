<template>
  <v-card flat>
    <v-card-title>
      <v-select
        v-model="filters.season"
        :items="seasonOptions"
        item-text="text"
        item-value="id"
        label="Season"
        clearable
      />

      <v-spacer />

      <v-select
        v-model="filters.competition"
        :items="matches.map(m => m.competition)"
        label="Competition"
        clearable
      />

      <v-spacer />

      <v-checkbox
        v-model="filters.showAll"
        label="Include Inactive Players"
      />
    </v-card-title>

    <v-card-text>
      <paged-table
        v-model="page"
        :page-count="pageCount"
      >
        <template #table>
          <v-data-table
            :headers="headers"
            :items="items"
            sort-by="matches"
            sort-desc
            must-sort
            :mobile-breakpoint="0"
            hide-default-footer
            :page.sync="page"
            @page-count="pageCount = $event"
          >
            <template #item.name="{ item: player }">
              <a @click="goToPlayer(player)">
                {{ player.name }}
              </a>
            </template>
          </v-data-table>
        </template>
      </paged-table>
    </v-card-text>
  </v-card>
</template>

<script>
  import { mixins, Component, Prop } from 'nuxt-property-decorator'
  import { Goal, Player } from '@/models'
  import { TeamAccessible } from '@/mixins'
  import { PagedTable } from '@/helpers'

  @Component({
    components: {
      PagedTable
    }
  })
  export default class PlayerPartnershipsTable extends mixins(TeamAccessible) {
    @Prop({ type: Object, required: true }) player

    filters = {
      season: null,
      competition: null,
      showAll: false
    }
    headers = [
      {
        text: 'Player',
        value: 'name'
      },
      {
        text: 'Matches',
        value: 'matches',
        align: 'center'
      },
      {
        text: 'Goals',
        value: 'goals',
        align: 'center'
      },
      {
        text: 'Assists',
        value: 'assists',
        align: 'center'
      }
    ]
    page = 1
    pageCount = 0

    get items () {
      const data = []

      this.players.forEach(player => {
        if (player.id !== this.player.id) {
          const matchesWith = this.matchesWith(player)

          if (matchesWith.length > 0) {
            data.push({
              id: player.id,
              name: player.name,
              matches: matchesWith.length,
              goals: this.numGoalsWith(player, matchesWith),
              assists: this.numAssistsFor(player, matchesWith)
            })
          }
        }
      })

      return data
    }

    get matches () {
      const season = this.filters.season
      const competition = this.filters.competition
      return this.player.matches.filter(match =>
        (!season || season === match.season) &&
        (!competition || competition === match.competition)
      )
    }

    get players () {
      return Player
        .query()
        .with('matches')
        .where('isActive', val => this.filters.showAll || val)
        .get()
    }

    get seasonOptions () {
      return this.matches.map(m => ({
        id: m.season,
        text: this.seasonLabel(m.season)
      }))
    }

    matchesWith (player) {
      const playerMatchIds = player.matches.map(m => m.id)
      return this.matches.filter(m => playerMatchIds.includes(m.id))
    }

    numGoalsWith (player, matches) {
      return Goal
        .query()
        .where('match_id', matches.map(m => m.id))
        .where('player_id', this.player.id)
        .where('assist_id', player.id)
        .count()
    }

    numAssistsFor (player, matches) {
      return Goal
        .query()
        .where('match_id', matches.map(m => m.id))
        .where('player_id', player.id)
        .where('assist_id', this.player.id)
        .count()
    }

    goToPlayer (player) {
      this.$router.push({
        name: 'teams-teamId-players-playerId',
        params: {
          teamId: this.team.id,
          playerId: player.id
        }
      })
    }
  }
</script>
