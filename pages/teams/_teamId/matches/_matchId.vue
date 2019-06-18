<template>
  <v-container
    fluid
    grid-list-lg
  >
    <v-layout wrap>
      <v-flex xs12>
        <div class="overline">{{ team.title }}</div>
        <div class="headline font-weight-thin">
          Match
          <small>v {{ match.opponent }}</small>
        </div>
      </v-flex>

      <v-flex xs12>
        <v-btn
          v-if="prevMatchLink"
          :to="prevMatchLink"
          nuxt
          color="blue-grey"
          outlined
        >Previous Match</v-btn>

        <v-btn
          v-if="nextMatchLink"
          :to="nextMatchLink"
          nuxt
          color="blue-grey"
          outlined
        >Next Match</v-btn>

        <match-form v-else />
      </v-flex>

      <v-layout
        class="text-xs-center"
        wrap
      >
        <v-flex xs12>
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
            {{ $_formatDate(match.date_played) }}
          </div>
        </v-flex>
        <v-layout
          class="display-1"
          justify-space-between
          align-center
        >
          <v-flex
            xs5
            class="font-weight-thin pa-3"
          >
            <fitty-text :text="match.home" />
            <div :class="`${resultColor}--text font-weight-bold`">
              {{ match.home_score }}
              <span v-if="match.penalty_shootout">
                ({{ match.penalty_shootout.home_score }})
              </span>
            </div>
          </v-flex>
          <v-flex
            xs5
            class="font-weight-thin pa-3"
          >
            <fitty-text :text="match.away" />
            <div :class="`${resultColor}--text font-weight-bold`">
              {{ match.away_score }}
              <span v-if="match.penalty_shootout">
                ({{ match.penalty_shootout.away_score }})
              </span>
            </div>
          </v-flex>
        </v-layout>

        <v-flex xs12>
          <match-actions
            v-if="match.date_played === team.current_date"
            :match="match"
          />
        </v-flex>
      </v-layout>

      <v-flex xs12>
        <v-card outlined>
          <v-card-text>
            <v-tabs
              v-model="tab"
              centered
            >
              <v-tab>Lineup</v-tab>
              <v-tab>Timeline</v-tab>
            </v-tabs>

            <v-tabs-items
              v-model="tab"
              touchless
            >
              <v-tab-item>
                <match-lineup :match="match" />
              </v-tab-item>

              <v-tab-item>
                <match-timeline :match="match" />
              </v-tab-item>
            </v-tabs-items>
          </v-card-text>
        </v-card>
      </v-flex>

    </v-layout>
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
    }
  })
  export default class MatchPage extends mixins(TeamAccessible) {
    layout = () => 'default'
    middleware = () => 'authenticated'

    head () {
      return {
        title: `${this.match.home} vs ${this.match.away}`
      }
    }

    tab = 0

    get match () {
      return Match
        .query()
        .withAll()
        .find(this.$route.params.matchId)
    }

    get players () {
      return Player
        .query()
        .where('team_id', this.team.id)
        .get()
    }

    get resultColor () {
      switch (this.match.team_result) {
        case 'win':
          return 'success'
        case 'draw':
          return 'warning'
        case 'loss':
          return 'red'
        default:
          return ''
      }
    }

    get prevMatchLink () {
      const prevMatch = Match
        .query()
        .where('date_played', date => date < this.match.date_played)
        .orderBy('date_played')
        .last()
      return prevMatch && {
        name: 'teams-teamId-matches-matchId',
        params: {
          teamId: this.team.id,
          matchId: prevMatch.id
        }
      }
    }

    get nextMatchLink () {
      const nextMatch = Match
        .query()
        .where('date_played', date => date > this.match.date_played)
        .orderBy('date_played')
        .first()
      return nextMatch && {
        name: 'teams-teamId-matches-matchId',
        params: {
          teamId: this.team.id,
          matchId: nextMatch.id
        }
      }
    }

    mounted () {
      this.$store.commit('app/SET_TITLE', this.team.title)
    }
  }
</script>
