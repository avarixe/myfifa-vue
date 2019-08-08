<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-btn
          v-if="prevMatchLink"
          :to="prevMatchLink"
        >
          Previous Match
        </v-btn>

        <v-btn
          v-if="nextMatchLink"
          :to="nextMatchLink"
        >
          Next Match
        </v-btn>

        <match-form v-else />
      </v-col>

      <v-row class="text-center">
        <v-col cols="12">
          <div class="display-2">
            <fitty-text :text="match.competition" />
          </div>
          <div
            v-if="match.stage"
            class="display-1"
          >
            <fitty-text
              :text="match.stage"
              :max-size="30"
            />
          </div>
          <div class="subheading">
            {{ $_formatDate(match.played_on) }}
          </div>
        </v-col>
        <v-row
          class="display-1"
          justify="space-between"
          align="center"
        >
          <v-col
            cols="5"
            class="font-weight-thin pa-3"
          >
            <fitty-text :text="match.home" />
            <div :class="`${match.resultColor}--text font-weight-bold`">
              {{ match.home_score }}
              <span v-if="match.penalty_shootout">
                ({{ match.penalty_shootout.home_score }})
              </span>
            </div>
          </v-col>
          <v-col
            cols="5"
            class="font-weight-thin pa-3"
          >
            <fitty-text :text="match.away" />
            <div :class="`${match.resultColor}--text font-weight-bold`">
              {{ match.away_score }}
              <span v-if="match.penalty_shootout">
                ({{ match.penalty_shootout.away_score }})
              </span>
            </div>
          </v-col>
        </v-row>

        <v-col cols="12">
          <match-actions
            v-if="match.played_on === team.currently_on"
            :match="match"
          />
        </v-col>
      </v-row>

      <v-col cols="12">
        <v-card>
          <v-card-text>
            <v-tabs centered>
              <v-tab>Lineup</v-tab>
              <v-tab>Timeline</v-tab>

              <v-tab-item>
                <match-lineup :match="match" />
              </v-tab-item>

              <v-tab-item>
                <match-timeline :match="match" />
              </v-tab-item>
            </v-tabs>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { mixins, Component } from 'nuxt-property-decorator'
  import { Match, Player } from '@/models'
  import MatchForm from '@/components/Match/Form'
  import MatchActions from '@/components/Match/Actions'
  import MatchLineup from '@/components/Match/Lineup'
  import MatchTimeline from '@/components/Match/Timeline'
  import { FittyText } from '@/helpers'
  import { TeamAccessible } from '@/mixins'

  @Component({
    components: {
      FittyText,
      MatchForm,
      MatchActions,
      MatchLineup,
      MatchTimeline
    },
    transition: 'fade-transition'
  })
  export default class MatchPage extends mixins(TeamAccessible) {
    layout = () => 'default'
    middleware = () => 'authenticated'

    tab = 0

    get match () {
      return Match
        .query()
        .with('team|caps|goals|bookings|substitutions|penalty_shootout')
        .find(this.$route.params.matchId)
    }

    get players () {
      return Player
        .query()
        .where('team_id', this.team.id)
        .get()
    }

    get prevMatchLink () {
      const prevMatch = Match
        .query()
        .where('team_id', this.match.team_id)
        .where('played_on', date => date < this.match.played_on)
        .orderBy('played_on')
        .last()
      return prevMatch && prevMatch.link
    }

    get nextMatchLink () {
      const nextMatch = Match
        .query()
        .where('team_id', this.match.team_id)
        .where('played_on', date => date > this.match.played_on)
        .orderBy('played_on')
        .first()
      return nextMatch && nextMatch.link
    }

    async fetch ({ store, params }) {
      await Promise.all([
        store.dispatch('matches/GET', { matchId: params.matchId }),

        store.dispatch('caps/FETCH', { matchId: params.matchId }),
        store.dispatch('goals/FETCH', { matchId: params.matchId }),
        store.dispatch('substitutions/FETCH', { matchId: params.matchId }),
        store.dispatch('bookings/FETCH', { matchId: params.matchId }),

        store.dispatch('competitions/FETCH', { teamId: params.teamId }),
        store.dispatch('players/FETCH', { teamId: params.teamId }),
        store.dispatch('playerHistories/SEARCH', { teamId: params.teamId }),
        store.dispatch('squads/FETCH', { teamId: params.teamId })
      ])
    }

    beforeMount () {
      this.$store.commit('app/SET_PAGE', {
        title: `${this.match.home} vs ${this.match.away}`,
        overline: this.team.title,
        headline: 'Match',
        caption: `v ${this.match.opponent}`
      })
    }
  }
</script>
