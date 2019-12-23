<template lang="pug">
  v-container(fluid)
    v-row
      v-col(cols=12)
        v-btn(v-if="prevMatchLink" :to="prevMatchLink") Previous Match
        |&nbsp;
        v-btn(v-if="nextMatchLink" :to="nextMatchLink") Next Match
        match-form(v-else)
      v-container
        v-row.text-center
          v-col(cols=12)
            .display-2
              fitty-text(:text="match.competition")
            .display-1(v-if="match.stage")
              fitty-text(:text="match.stage" max-size=30)
            .subheading {{ match.played_on | formatDate }}
          v-row.display-1(justify="space-between" align=center)
            v-col.font-weight-thin.pa-3(cols=5)
              fitty-text(:text="match.home")
              .font-weight-bold(:class="`${match.resultColor}--text`")
                | {{ match.home_score }}
                span(v-if="match.penalty_shootout")
                  | ({{ match.penalty_shootout.home_score }})
            v-col.font-weight-thin.pa-3(cols=5)
              fitty-text(:text="match.away")
              .font-weight-bold(:class="`${match.resultColor}--text`")
                | {{ match.away_score }}
                span(v-if="match.penalty_shootout")
                  | ({{ match.penalty_shootout.away_score }})
          v-col(v-if="match.played_on === team.currently_on" cols=12)
            match-actions(:match="match")
      v-col(cols=12)
        v-card
          v-card-text
            v-tabs(centered)
              v-tab Lineup
              v-tab Timeline
              v-tab-item
                match-lineup(:match="match")
              v-tab-item
                match-timeline(:match="match")
</template>

<script>
  import { mapMutations } from 'vuex'
  import { Match, Player } from '@/models'
  import MatchForm from '@/components/Match/Form'
  import MatchActions from '@/components/Match/Actions'
  import MatchLineup from '@/components/Match/Lineup'
  import MatchTimeline from '@/components/Match/Timeline'
  import { FittyText } from '@/helpers'
  import { TeamAccessible } from '@/mixins'

  export default {
    name: 'MatchPage',
    components: {
      FittyText,
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
