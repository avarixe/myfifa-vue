<template>
  <v-container>
    <v-skeleton-loader
      :loading="$fetchState.pending"
      type="article"
    >
      <v-row>
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
          <match-form
            :record="match"
            color="orange"
          >
            <template #default="{ on }">
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
          <record-remove
            :record="match"
            store="matches"
            :label="`${match.home} v ${match.away}`"
          >
            <template #default="{ on }">
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
              <div class="text-h3">
                <fitty-text :text="match.competition" />
              </div>
              <div
                v-if="match.stage"
                class="text-h4"
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
                class="text-h4"
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
          <v-container>
            <v-row>
              <v-col cols="7">
                <v-card>
                  <v-card-title class="justify-center font-weight-light">
                    Lineup
                  </v-card-title>
                  <v-card-text>
                    <match-lineup :match="match" />
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="5">
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
    </v-skeleton-loader>
  </v-container>
</template>

<script>
  import { mapMutations, mapActions } from 'vuex'
  import { TeamAccessible } from '@/mixins'

  export default {
    name: 'MatchPage',
    mixins: [
      TeamAccessible
    ],
    middleware: [
      'authenticated'
    ],
    transition: 'fade-transition',
    computed: {
      matchId () {
        return this.$route.params.matchId
      },
      match () {
        return this.$store.$db().model('Match')
          .query()
          .with('team|caps|goals|bookings|substitutions|penalty_shootout')
          .find(this.matchId)
      },
      players () {
        return this.$store.$db().model('Player')
          .query()
          .where('team_id', this.team.id)
          .get()
      },
      readonly () {
        return this.match.played_on !== this.team.currently_on
      },
      prevMatchLink () {
        const prevMatch = this.$store.$db().model('Match')
          .query()
          .where('team_id', this.match.team_id)
          .where('played_on', date => date < this.match.played_on)
          .orderBy('played_on')
          .last()
        return prevMatch && prevMatch.link
      },
      nextMatchLink () {
        const nextMatch = this.$store.$db().model('Match')
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
    async fetch () {
      await Promise.all([
        this.getMatch({ matchId: this.matchId }),
        this.fetchPlayers({ teamId: this.team.id }),
        this.searchPlayerHistories({ teamId: this.team.id })
      ])

      if (!this.readonly) {
        await this.fetchSquads({ teamId: this.team.id })
      }

      this.setPage({
        title: `${this.match.home} vs ${this.match.away}`,
        headline: 'Match',
        caption: `v ${this.match.opponent}`
      })
    },
    methods: {
      ...mapMutations('app', {
        setPage: 'setPage'
      }),
      ...mapActions({
        getMatch: 'matches/get',
        fetchPlayers: 'players/fetch',
        searchPlayerHistories: 'playerHistories/search',
        fetchSquads: 'squads/fetch'
      })
    }
  }
</script>
