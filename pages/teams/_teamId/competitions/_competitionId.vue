<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-btn
          :to="competition.linkToSeason"
          nuxt
          outlined
          color="blue-grey"
        >
          View Season
        </v-btn>
      </v-col>

      <v-col cols="12">
        <v-row class="text-center">
          <v-col cols="12">
            <div class="subheading">
              {{ competitionSeason }}
            </div>
            <div class="display-1 primary--text">
              <fitty-text :text="competition.name" />
            </div>
            <div
              v-if="readonly"
              class="title"
            >
              <v-icon
                color="yellow darken-2"
                left
              >
                mdi-crown
              </v-icon>
              {{ competition.champion }}
              <v-icon
                color="yellow darken-2"
                right
              >
                mdi-crown
              </v-icon>
            </div>
          </v-col>

          <v-col
            v-if="!readonly"
            cols="12"
          >
            <competition-form
              :competition-data="competition"
              color="orange"
            >
              <template #default="{ on }">
                <v-btn
                  dark
                  color="orange"
                  class="my-1"
                  v-on="on"
                >
                  Edit
                </v-btn>
              </template>
            </competition-form>

            <competition-form
              :competition-data="competition"
              color="red"
              close
            >
              <template #default="{ on }">
                <v-btn
                  dark
                  color="red"
                  class="my-1"
                  v-on="on"
                >
                  Close
                </v-btn>
              </template>
            </competition-form>

            <stage-form
              :competition="competition"
              color="teal"
            >
              <template #default="{ on }">
                <v-btn
                  dark
                  color="teal"
                  class="my-1"
                  v-on="on"
                >
                  Add Stage
                </v-btn>
              </template>
            </stage-form>

            <record-remove
              :record="competition"
              store="competitions"
              :label="`${competitionSeason} ${competition.name}`"
              :redirect="competition.linkToSeason"
            >
              <v-btn
                dark
                class="my-1"
              >
                Remove
              </v-btn>
            </record-remove>
          </v-col>
        </v-row>
      </v-col>

      <!-- Table Stages -->
      <v-col
        v-if="tables.length > 0"
        cols="12"
      >
        <v-card outlined>
          <v-card-text>
            <v-tabs
              v-model="table"
              centered
              center-active
            >
              <v-tab
                v-for="table in tables"
                :key="table.id"
              >
                {{ table.name }}
              </v-tab>
            </v-tabs>

            <v-tabs-items
              v-model="table"
              touchless
            >
              <v-tab-item
                v-for="table in tables"
                :key="table.id"
              >
                <table-stage
                  :table="table"
                  :readonly="readonly"
                />
              </v-tab-item>
            </v-tabs-items>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Elimination Round Stages -->
      <v-col
        v-if="rounds.length > 0"
        cols="12"
      >
        <v-card outlined>
          <v-card-text>
            <v-tabs
              centered
              center-active
            >
              <v-tab
                v-for="round in rounds"
                :key="round.id"
              >
                {{ round.name }}
              </v-tab>

              <v-tab-item
                v-for="round in rounds"
                :key="round.id"
              >
                <round-stage
                  :round="round"
                  :readonly="readonly"
                />
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
  import { Competition } from '@/models'
  import { FittyText, RecordRemove } from '@/helpers'
  import CompetitionForm from '@/components/Competition/Form'
  import StageForm from '@/components/Stage/Form'
  import RoundStage from '@/components/Stage/Round'
  import TableStage from '@/components/Stage/Table'
  import { TeamAccessible } from '@/mixins'

  @Component({
    components: {
      FittyText,
      RecordRemove,
      CompetitionForm,
      RoundStage,
      TableStage,
      StageForm
    },
    transition: 'fade-transition'
  })
  export default class CompetitionPage extends mixins(TeamAccessible) {
    layout = () => 'default'
    middleware = () => 'authenticated'

    head () {
      return {
        title: `${this.competition.name} (${this.competitionSeason})`
      }
    }

    table = 0

    get competition () {
      return Competition
        .query()
        .with('stages.table_rows')
        .with('stages.fixtures.legs')
        .find(this.$route.params.competitionId)
    }

    get title () {
      return `${this.competition.name} (${this.competitionSeason})`
    }

    get stages () {
      return this.competition.stages
    }

    get tables () {
      return this.stages.filter(stage => stage.table)
    }

    get rounds () {
      return this.stages.filter(stage => !stage.table)
    }

    get readonly () {
      return this.competition.champion &&
        this.competition.champion.length > 0
    }

    get competitionSeason () {
      return this.seasonLabel(this.competition.season)
    }

    async fetch ({ store, params }) {
      await Promise.all([
        store.dispatch('competitions/GET', {
          competitionId: params.competitionId
        }),
        store.dispatch('stages/FETCH', { competitionId: params.competitionId })
      ])
    }

    mounted () {
      this.$store.commit('app/SET_PAGE', {
        title: this.title,
        overline: this.team.title,
        headline: this.title
      })
    }
  }
</script>

<style scoped>
  .v-card + .v-card {
    margin-top: 1rem;
  }
</style>
