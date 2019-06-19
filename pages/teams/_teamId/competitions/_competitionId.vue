<template>
  <v-container
    fluid
    grid-list-lg
  >
    <v-layout wrap>
      <v-flex xs12>
        <div class="overline">{{ team.title }}</div>
        <div class="headline font-weight-thin">
          {{ competition.name }}
          ({{ competitionSeason }})
        </div>
      </v-flex>

      <v-flex xs12>
        <v-btn
          :to="competition.linkToSeason"
          nuxt
          outlined
          color="blue-grey"
        >View Season</v-btn>
      </v-flex>

      <v-flex xs12>
        <v-layout
          class="text-xs-center"
          wrap
        >
          <v-flex xs12>
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
              >mdi-crown</v-icon>
              {{ competition.champion }}
              <v-icon
                color="yellow darken-2"
                right
              >mdi-crown</v-icon>
            </div>
          </v-flex>

          <v-flex
            v-if="!readonly"
            xs12
          >
            <competition-form
              :competition-data="competition"
              color="orange"
            >
              <template #default="{ on }">
                <v-btn
                  v-on="on"
                  dark
                  color="orange"
                  class="my-1"
                >Edit</v-btn>
              </template>
            </competition-form>

            <competition-form
              :competition-data="competition"
              color="red"
              close
            >
              <template #default="{ on }">
                <v-btn
                  v-on="on"
                  dark
                  color="red"
                  class="my-1"
                >Close</v-btn>
              </template>
            </competition-form>

            <stage-form
              :competition="competition"
              color="teal"
            >
              <template #default="{ on }">
                <v-btn
                  v-on="on"
                  dark
                  color="teal"
                  class="my-1"
                >Add Stage</v-btn>
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
              >Remove</v-btn>
            </record-remove>
          </v-flex>
        </v-layout>
      </v-flex>

      <!-- Table Stages -->
      <v-flex
        v-if="tables.length > 0"
        xs12
      >
        <v-card outlined>
          <v-card-text>
            <v-tabs
              centered
              center-active
            >
              <v-tab
                v-for="table in tables"
                :key="table.id"
              >{{ table.name }}</v-tab>

              <v-tab-item
                v-for="table in tables"
                :key="table.id"
              >
                <table-stage
                  :table="table"
                  :readonly="readonly"
                />
              </v-tab-item>
            </v-tabs>
          </v-card-text>
        </v-card>
      </v-flex>

      <!-- Elimination Round Stages -->
      <v-flex
        v-if="rounds.length > 0"
        xs12
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
              >{{ round.name }}</v-tab>

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
      </v-flex>
    </v-layout>
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
    }
  })
  export default class CompetitionPage extends mixins(TeamAccessible) {
    layout = () => 'default'
    middleware = () => 'authenticated'

    head () {
      return {
        title: `${this.competition.name} (${this.competitionSeason})`
      }
    }

    get competition () {
      return Competition
        .query()
        .with('stages.table_rows|fixtures')
        .find(this.$route.params.competitionId)
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

    mounted () {
      this.$store.commit('app/SET_TITLE', this.team.title)
    }
  }
</script>

<style scoped>
  .v-card + .v-card {
    margin-top: 1rem;
  }
</style>
