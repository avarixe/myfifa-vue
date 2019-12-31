<template lang="pug">
  v-container(fluid)
    v-row
      v-col(cols=12)
        v-btn(:to="competition.linkToSeason" nuxt) View Season
      v-col.text-center(cols=12)
        .subheading
          | {{ competitionSeason }}
        .display-1.primary--text
          fitty-text(:text="competition.name")
        .title(v-if="readonly")
          v-icon(color="yellow darken-2" left) mdi-crown
          | {{ competition.champion }}
          v-icon(color="yellow darken-2" right) mdi-crown
      v-col.text-center(v-if="!readonly" cols=12)
        competition-form(:record="competition" color="orange")
          template(#default="{ on }")
            v-btn.my-1(dark color="orange" v-on="on") Edit
        |&nbsp;
        competition-form(:record="competition" color="red" close)
          template(#default="{ on }")
            v-btn.my-1(dark color="red" v-on="on") Close
        |&nbsp;
        stage-form(:competition="competition" color="teal")
        |&nbsp;
        record-remove(
          :record="competition"
          store="competitions"
          :label="`${competitionSeason} ${competition.name}`"
          :redirect="competition.linkToSeason"
        )
          v-btn.my-1(dark) Remove
      //- Table Stages
      v-col(v-if="tables.length > 0" cols=12)
        v-card(outlined)
          v-card-text
            v-tabs(v-model="table" centered center-active)
              v-tab(v-for="table in tables" :key="table.id") {{ table.name }}
            v-tabs-items(v-model="table" touchless)
              v-tab-item(v-for="table in tables" :key="table.id")
                table-stage(:table="table" :readonly="readonly")
      //- Elimination Round Stages
      v-col(v-if="rounds.length > 0" cols=12)
        v-card(outlined)
          v-card-text
            v-tabs(centered center-active)
              v-tab(v-for="round in rounds" :key="round.id") {{ round.name }}
              v-tab-item(v-for="round in rounds" :key="round.id")
                round-stage(:round="round" :readonly="readonly")
</template>

<script>
  import { mapMutations } from 'vuex'
  import { Competition } from '@/models'
  import CompetitionForm from '@/components/Competition/Form'
  import StageForm from '@/components/Stage/Form'
  import RoundStage from '@/components/Stage/Round'
  import TableStage from '@/components/Stage/Table'
  import { TeamAccessible } from '@/mixins'

  export default {
    name: 'CompetitionPage',
    components: {
      CompetitionForm,
      RoundStage,
      TableStage,
      StageForm
    },
    mixins: [
      TeamAccessible
    ],
    middleware: [
      'authenticated'
    ],
    transition: 'fade-transition',
    data: () => ({
      table: 0
    }),
    computed: {
      competition () {
        return Competition
          .query()
          .with('stages.table_rows')
          .with('stages.fixtures.legs')
          .find(this.$route.params.competitionId)
      },
      title () {
        return `${this.competition.name} (${this.competitionSeason})`
      },
      stages () {
        return this.competition.stages
      },
      tables () {
        return this.stages.filter(stage => stage.table)
      },
      rounds () {
        return this.stages.filter(stage => !stage.table)
      },
      readonly () {
        return this.competition.champion &&
          this.competition.champion.length > 0
      },
      competitionSeason () {
        return this.seasonLabel(this.competition.season)
      }
    },
    async fetch ({ store, params }) {
      await Promise.all([
        store.dispatch('competitions/GET', {
          competitionId: params.competitionId
        }),
        store.dispatch('stages/FETCH', { competitionId: params.competitionId })
      ])
    },
    mounted () {
      this.setPage({
        title: this.title,
        overline: this.team.title,
        headline: this.title
      })
    },
    methods: mapMutations('app', {
      setPage: 'SET_PAGE'
    }),
    head () {
      return {
        title: `${this.competition.name} (${this.competitionSeason})`
      }
    }
  }
</script>

<style scoped>
  .v-card + .v-card {
    margin-top: 1rem;
  }
</style>
