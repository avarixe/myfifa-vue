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
          ({{ seasonLabel(competition.season) }})
        </div>
      </v-flex>

      <v-flex xs12>
        <v-btn
          :to="seasonLink"
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
              {{ seasonLabel(competition.season) }}
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

            <competition-remove :competition="competition" />
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
              v-model="tab1"
              centered
              center-active
            >
              <v-tab
                v-for="table in tables"
                :key="table.id"
              >{{ table.name }}</v-tab>
            </v-tabs>

            <v-tabs-items
              v-model="tab1"
              touchless
            >
              <v-tab-item
                v-for="table in tables"
                :key="table.id"
              >
                <competition-table
                  :table="table"
                  :readonly="readonly"
                />
              </v-tab-item>
            </v-tabs-items>
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
              v-model="tab2"
              centered
              center-active
            >
              <v-tab
                v-for="round in rounds"
                :key="round.id"
              >{{ round.name }}</v-tab>
            </v-tabs>

            <v-tabs-items
              v-model="tab2"
              touchless
            >
              <v-tab-item
                v-for="round in rounds"
                :key="round.id"
              >
                <competition-round
                  :round="round"
                  :readonly="readonly"
                />
              </v-tab-item>
            </v-tabs-items>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import { Competition } from '@/models'
  import { FittyText } from '@/helpers'
  import CompetitionForm from '@/components/Competition/Form'
  import CompetitionTable from '@/components/Competition/Table'
  import CompetitionRound from '@/components/Competition/Round'
  import CompetitionRemove from '@/components/Competition/Remove'
  import StageForm from '@/components/Stage/Form'
  import { TeamAccessible } from '@/mixins'

  export default {
    layout: 'team',
    middleware: 'authenticated',
    mixins: [
      TeamAccessible
    ],
    components: {
      FittyText,
      CompetitionForm,
      CompetitionTable,
      CompetitionRound,
      CompetitionRemove,
      StageForm
    },
    data: () => ({
      tab1: 0,
      tab2: 0
    }),
    head () {
      return {
        title:
          this.competition.name +
          ` (${this.seasonLabel(this.competition.season)})`
      }
    },
    computed: {
      competition () {
        return Competition
          .query()
          .with('stages.table_rows|fixtures')
          .find(this.$route.params.competitionId)
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
      seasonLink () {
        return {
          name: 'teams-teamId-seasons-season',
          params: {
            teamId: this.team.id,
            season: this.competition.season
          }
        }
      }
    },
    mounted () {
      this.$store.commit('app/SET_TITLE', this.team.title)
    },
    watch: {
      competition (val) {
        !val && this.$router.push({
          name: 'teams-teamId-seasons',
          params: { teamId: this.team.id }
        })
      }
    }
  }
</script>

<style scoped>
  .v-card + .v-card {
    margin-top: 1rem;
  }
</style>
