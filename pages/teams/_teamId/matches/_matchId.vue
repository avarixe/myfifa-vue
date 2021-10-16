<script>
  import {
    ref,
    computed,
    watchEffect,
    useContext,
    useFetch,
    useRoute,
    useRouter,
    useStore
  } from '@nuxtjs/composition-api'
  import { gql } from 'nuxt-graphql-request'
  import { useMatch, useTeam } from '@/composables'
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
    setup () {
      const { matchId, match } = useMatch()
      const { teamId } = useTeam()
      const router = useRouter()
      watchEffect(() => {
        if (!match.value) {
          router.push({
            name: 'teams-teamId-matches',
            params: { teamId: teamId.value }
          })
        }
      })

      const { $graphql } = useContext()
      const store = useStore()
      const readonly = ref(true)
      useFetch(async () => {
        const query = gql`
          query fetchMatchPage($matchId: ID!, $teamId: ID!) {
            match(id: $matchId) {
              ...MatchData
              caps { ...CapData }
              goals { ...GoalData }
              substitutions { ...SubstitutionData }
              bookings { ...BookingData }
              penaltyShootout { ...PenaltyShootoutData }
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

        const { match: matchData, team } = await $graphql.default.request(query, {
          matchId: matchId.value,
          teamId: teamId.value
        })

        await Promise.all([
          store.$db().model('Match').insert({ data: matchData }),
          store.$db().model('Team').insert({ data: team })
        ])

        readonly.value = matchData.playedOn !== team.currentlyOn

        store.commit('app/setPage', {
          title: `${matchData.home} vs ${matchData.away}`,
          headline: 'Match',
          caption: `v ${match.value.opponent}`
        })
      })

      return {
        match,
        readonly,
        prevMatchLink: computed(() => {
          const prevMatch = store.$db().model('Match')
            .query()
            .where('teamId', teamId.value)
            .where('playedOn', date => date < match.value.playedOn)
            .orderBy('playedOn')
            .last()
          return prevMatch ? prevMatch.link : null
        }),
        nextMatchLink: computed(() => {
          const nextMatch = store.$db().model('Match')
            .query()
            .where('teamId', teamId.value)
            .where('playedOn', date => date > match.value.playedOn)
            .orderBy('playedOn')
            .first()
          return nextMatch ? nextMatch.link : null
        })
      }
    }
  }
</script>

<template>
  <v-container>
    <v-row v-if="match">
      <v-col cols="12">
        <v-btn
          v-if="prevMatchLink"
          :to="prevMatchLink"
          class="mb-1"
        >
          Previous Match
        </v-btn>
        <v-btn
          v-if="nextMatchLink"
          :to="nextMatchLink"
          class="mb-1"
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
