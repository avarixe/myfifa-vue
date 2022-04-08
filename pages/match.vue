<template>
  <v-container>
    <v-row v-if="match">
      <v-col cols="12">
        <v-btn
          v-if="previousMatch"
          :to="{ name: 'match', query: { teamId, matchId: previousMatch.id } }"
          class="mb-1"
          exact
        >
          Previous Match
        </v-btn>
        <v-btn
          v-if="nextMatch"
          :to="{ name: 'match', query: { teamId, matchId: nextMatch.id } }"
          class="mb-1"
          exact
        >
          Next Match
        </v-btn>
        <match-form :record="match">
          <template #activator="{ on }">
            <v-btn
              color="orange"
              dark
              class="mb-1"
              v-on="on"
            >
              Edit
            </v-btn>
          </template>
        </match-form>
        <v-btn
          class="mb-1"
          @click="readonly = !readonly"
        >
          <v-icon left>
            mdi-{{ readonly ? 'pencil-off' : 'circle-edit-outline' }}
          </v-icon>
          {{ readonly ? 'Readonly' : 'Edit' }} Mode
        </v-btn>
        <record-remove
          :record="match"
          store="matches"
          :label="`${match.home} v ${match.away}`"
        >
          <template #activator="{ on }">
            <v-btn
              dark
              class="mb-1"
              v-on="on"
            >
              Remove
            </v-btn>
          </template>
        </record-remove>
      </v-col>

      <v-container class="py-0">
        <v-row class="text-center">
          <v-col cols="12">
            <div class="text-h4">{{ match.competition }}</div>
            <div
              v-if="match.stage"
              class="text-h5"
            >
              {{ match.stage }}
            </div>
            <div class="subheading">{{ match.playedOn | formatDate }}</div>
          </v-col>
          <v-container class="py-0">
            <v-row
              class="text-h6 text-sm-h4"
              justify="space-between"
              align="center"
            >
              <v-col
                class="font-weight-light pa-3"
                cols="5"
              >
                {{ match.home }}
                <div :class="`font-weight-bold ${match.resultColor}--text text-h4`">
                  {{ match.homeScore }}
                  <span v-if="match.penaltyShootout">
                    ({{ match.penaltyShootout.homeScore }})
                  </span>
                </div>
              </v-col>
              <v-col
                class="font-weight-light pa-3"
                cols="5"
              >
                {{ match.away }}
                <div :class="`font-weight-bold ${match.resultColor}--text text-h4`">
                  {{ match.awayScore }}
                  <span v-if="match.penaltyShootout">
                    ({{ match.penaltyShootout.awayScore }})
                  </span>
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-row>
      </v-container>
      <v-col
        class="hidden-lg-and-up"
        cols="12"
      >
        <v-card class="mt-2">
          <v-card-text>
            <v-tabs centered>
              <v-tab>Overview</v-tab>
              <v-tab>Timeline</v-tab>
              <v-tab-item>
                <match-overview
                  :match="match"
                  :readonly="readonly"
                />
              </v-tab-item>
              <v-tab-item>
                <match-timeline
                  :match="match"
                  :readonly="readonly"
                />
              </v-tab-item>
            </v-tabs>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col
        class="hidden-md-and-down"
        cols="12"
      >
        <v-container>
          <v-row>
            <v-col cols="7">
              <v-card>
                <v-card-title class="justify-center font-weight-light">
                  Overview
                </v-card-title>
                <v-card-text>
                  <match-overview
                    :match="match"
                    :readonly="readonly"
                  />
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="5">
              <v-card>
                <v-card-title class="justify-center font-weight-light">
                  Timeline
                </v-card-title>
                <v-card-text>
                  <match-timeline
                    :match="match"
                    :readonly="readonly"
                  />
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
  import { gql } from 'nuxt-graphql-request'
  import { TeamAccessible } from '@/mixins'
  import {
    matchFragment,
    capFragment,
    goalFragment,
    substitutionFragment,
    bookingFragment,
    penaltyShootoutFragment,
    teamFragment,
    playerFragment,
    baseSquadFragment
  } from '@/fragments'

  export default {
    name: 'MatchPage',
    key: to => to.fullPath,
    mixins: [
      TeamAccessible
    ],
    transition (to, from) {
      if (from && from.query.matchId) {
        return `scroll-x${+to.query.matchId < +from.query.matchId ? '' : '-reverse'}-transition`
      } else {
        return 'fade-transition'
      }
    },
    async asyncData ({ route, $graphql, store, redirect }) {
      const { teamId, matchId } = route.query

      if (teamId && matchId) {
        const query = gql`
          query fetchMatchPage($matchId: ID!, $teamId: ID!) {
            match(id: $matchId) {
              ...MatchData
              caps { ...CapData }
              goals { ...GoalData }
              substitutions { ...SubstitutionData }
              bookings { ...BookingData }
              penaltyShootout { ...PenaltyShootoutData }
              previousMatch { id }
              nextMatch { id }
            }
            team(id: $teamId) {
              ...TeamData
              players { ...PlayerData }
              squads { ...BaseSquadData }
            }
          }
          ${matchFragment}
          ${capFragment}
          ${goalFragment}
          ${substitutionFragment}
          ${bookingFragment}
          ${penaltyShootoutFragment}
          ${teamFragment}
          ${playerFragment}
          ${baseSquadFragment}
        `

        const { match, team } =
          await $graphql.default.request(query, {
            matchId: parseInt(matchId),
            teamId: parseInt(teamId)
          })

        await Promise.all([
          store.$db().model('Match').insert({ data: match }),
          store.$db().model('Team').insert({ data: team })
        ])

        return {
          readonly: match.playedOn !== team.currentlyOn,
          previousMatch: match.previousMatch,
          nextMatch: match.nextMatch
        }
      } else if (teamId) {
        redirect({ name: 'team', query: { teamId } })
      } else {
        redirect('/')
      }
    },
    computed: {
      matchId () {
        return parseInt(this.$route.query.matchId)
      },
      match () {
        return this.$store.$db().model('Match')
          .query()
          .with('team|goals|bookings|substitutions|penaltyShootout')
          .with('caps.player')
          .find(this.matchId)
      },
      players () {
        return this.$store.$db().model('Player')
          .query()
          .where('teamId', this.teamId)
          .get()
      }
    },
    watch: {
      match () {
        if (this.match) {
          this.setPage({
            title: `${this.match.home} vs ${this.match.away}`,
            headline: 'Match',
            caption: `v ${this.match.opponent}`
          })
        } else {
          this.$router.push({
            name: 'matches',
            query: this.$route.query
          })
        }
      }
    },
    watchQuery: ['matchId'],
    methods: mapMutations('app', {
      setPage: 'setPage'
    })
  }
</script>
