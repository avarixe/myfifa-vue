<template lang="pug">
  v-container(fluid)
    v-row
      v-col(cols="12")
        v-btn(
          :to="linkToSeason(pageSeason - 1)"
          nuxt
          :disabled="pageSeason === 0"
        ) Previous Season
        |&nbsp;
        v-btn(
          :to="linkToSeason(pageSeason + 1)"
          nuxt
          :disabled="pageSeason >= season"
        ) Next Season
      v-col(cols="12")
        v-card
          v-card-text
            v-tabs(v-model="tab" centered)
              v-tab Competitions
              v-tab Players
            v-tabs-items(v-model="tab" touchless)
              v-tab-item
                competition-grid(:season="pageSeason")
              v-tab-item
                player-grid(:season="pageSeason")
</template>

<script>
  import { mapMutations } from 'vuex'
  import CompetitionGrid from '@/components/Season/CompetitionGrid'
  import PlayerGrid from '@/components/Season/PlayerGrid'
  import { TeamAccessible } from '@/mixins'

  export default {
    name: 'SeasonPage',
    components: {
      CompetitionGrid,
      PlayerGrid
    },
    mixins: [
      TeamAccessible
    ],
    middleware: [
      'authenticated'
    ],
    transition: 'fade-transition',
    data: () => ({
      tab: 0
    }),
    computed: {
      title () {
        return `${this.seasonLabel(this.pageSeason)} Season`
      },
      pageSeason () {
        return parseInt(this.$route.params.season)
      }
    },
    async fetch ({ store, params }) {
      await Promise.all([
        store.dispatch('competitions/FETCH', { teamId: params.teamId }),
        store.dispatch('players/FETCH', { teamId: params.teamId }),
        store.dispatch('playerHistories/SEARCH', { teamId: params.teamId }),
        store.dispatch('matches/FETCH', { teamId: params.teamId }),
        store.dispatch('contracts/SEARCH', { teamId: params.teamId })
      ])
    },
    mounted () {
      this.setPage({
        title: this.title,
        overline: this.team.title,
        headline: this.title
      })
    },
    methods: {
      ...mapMutations('app', {
        setPage: 'SET_PAGE'
      }),
      linkToSeason (season) {
        return {
          name: 'teams-teamId-seasons-season',
          params: {
            teamId: this.team.id,
            season
          }
        }
      }
    },
    head () {
      return {
        title: this.title
      }
    }
  }
</script>
