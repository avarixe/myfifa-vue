<template>
  <v-container
    v-if="match"
    fluid
  >
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
        <match-form
          :record="match"
          color="orange"
        >
          <template #default="{ on }">
            <v-btn
              color="orange"
              dark
              v-on="on"
            >
              Edit
            </v-btn>
          </template>
        </match-form>
        <record-remove
          class="ma-1"
          :record="match"
          store="matches"
          :label="`${match.home} v ${match.away}`"
        >
          <v-btn dark>Remove</v-btn>
        </record-remove>
      </v-col>
      <v-container class="py-0">
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
                max-size="30"
              />
            </div>
            <div class="subheading">{{ match.played_on | formatDate }}</div>
          </v-col>
          <v-container class="py-0">
            <v-row
              class="display-1"
              justify="space-between"
              align="center"
            >
              <v-col
                class="font-weight-thin pa-3"
                cols="5"
              >
                <fitty-text :text="match.home" />
                <div :class="`font-weight-bold ${match.resultColor}--text`">
                  {{ match.home_score }}
                  <span v-if="match.penalty_shootout">
                    ({{ match.penalty_shootout.home_score }})
                  </span>
                </div>
              </v-col>
              <v-col
                class="font-weight-thin pa-3"
                cols="5"
              >
                <fitty-text :text="match.away" />
                <div :class="`font-weight-bold ${match.resultColor}--text`">
                  {{ match.away_score }}
                  <span v-if="match.penalty_shootout">
                    ({{ match.penalty_shootout.away_score }})
                  </span>
                </div>
              </v-col>
            </v-row>
          </v-container>
          <v-col
            v-if="!readonly"
            cols="12"
          >
            <match-actions :match="match" />
          </v-col>
        </v-row>
      </v-container>
      <v-col
        class="hidden-lg-and-up"
        cols="12"
      >
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
      <v-col
        class="hidden-md-and-down"
        cols="12"
      >
        <v-container class="py-0">
          <v-row>
            <v-col cols="6">
              <v-card>
                <v-card-title class="justify-center font-weight-light">
                  Lineup
                </v-card-title>
                <v-card-text>
                  <match-lineup :match="match" />
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="6">
              <v-card>
                <v-card-title class="justify-center font-weight-light">
                  Timeline
                </v-card-title>
                <v-card-text>
                  <match-timeline :match="match" />
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { mapMutations } from 'vuex'
  import { Match, Player } from '@/models'
  import MatchForm from '@/components/Match/Form'
  import MatchActions from '@/components/Match/Actions'
  import MatchLineup from '@/components/Match/Lineup'
  import MatchTimeline from '@/components/Match/Timeline'
  import { TeamAccessible } from '@/mixins'

  export default {
    name: 'MatchPage',
    components: {
      MatchForm,
      MatchActions,
      MatchLineup,
      MatchTimeline
    },
    mixins: [
      TeamAccessible
    ],
    middleware: [
      'authenticated'
    ],
    transition: 'fade-transition',
    computed: {
      match () {
        return Match
          .query()
          .with('team|caps|goals|bookings|substitutions|penalty_shootout')
          .find(this.$route.params.matchId)
      },
      players () {
        return Player
          .query()
          .where('team_id', this.team.id)
          .get()
      },
      readonly () {
        return this.match.played_on !== this.team.currently_on
      },
      prevMatchLink () {
        const prevMatch = Match
          .query()
          .where('team_id', this.match.team_id)
          .where('played_on', date => date < this.match.played_on)
          .orderBy('played_on')
          .last()
        return prevMatch && prevMatch.link
      },
      nextMatchLink () {
        const nextMatch = Match
          .query()
          .where('team_id', this.match.team_id)
          .where('played_on', date => date > this.match.played_on)
          .orderBy('played_on')
          .first()
        return nextMatch && nextMatch.link
      }
    },
    watch: {
      match () {
        if (!this.match) {
          this.$router.push({
            name: 'teams-teamId-matches',
            params: this.$route.params
          })
        }
      }
    },
    async fetch ({ store, params }) {
      await Promise.all([
        store.dispatch('matches/GET', { matchId: params.matchId }),

        store.dispatch('caps/FETCH', { matchId: params.matchId }),
        store.dispatch('goals/FETCH', { matchId: params.matchId }),
        store.dispatch('substitutions/FETCH', { matchId: params.matchId }),
        store.dispatch('bookings/FETCH', { matchId: params.matchId }),

        store.dispatch('players/FETCH', { teamId: params.teamId }),
        store.dispatch('playerHistories/SEARCH', { teamId: params.teamId }),
        store.dispatch('squads/FETCH', { teamId: params.teamId })
      ])
    },
    mounted () {
      this.setPage({
        title: `${this.match.home} vs ${this.match.away}`,
        overline: this.team.title,
        headline: 'Match',
        caption: `v ${this.match.opponent}`
      })
    },
    methods: mapMutations('app', {
      setPage: 'SET_PAGE'
    })
  }
</script>
