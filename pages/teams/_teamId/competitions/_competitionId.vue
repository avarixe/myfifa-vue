<template>
  <v-container
    fluid
    grid-list-lg
  >
    <v-layout
      row
      wrap
    >
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
        >View Season</v-btn>
      </v-flex>

      <v-flex xs12>
        <material-card>
          <template #header>
            <v-layout
              class="text-xs-center"
              row
              wrap
            >
              <v-flex xs12>
                <div class="subheading">
                  {{ seasonLabel(competition.season) }}
                </div>
                <div class="display-1">{{ competition.name }}</div>
              </v-flex>
            </v-layout>
          </template>

          <v-layout
            class="text-xs-center"
            row
            wrap
          >
            <v-flex
              v-if="readonly"
              xs12
            >
              <div class="title">
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
              v-else
              xs12
            >
              <edit-competition-form
                :competition-data="competition"
                color="orange"
              >
                <template #default="{ on }">
                  <v-btn
                    v-on="on"
                    dark
                    color="orange"
                  >Edit</v-btn>
                </template>
              </edit-competition-form>

              <competition-close-form
                :competition-data="competition"
                color="red"
              >
                <template #default="{ on }">
                  <v-btn
                    v-on="on"
                    dark
                    color="red"
                  >Close</v-btn>
                </template>
              </competition-close-form>

              <stage-form
                :competition="competition"
                color="teal"
              >
                <template #default="{ on }">
                  <v-btn
                    v-on="on"
                    dark
                    color="teal"
                  >Add Stage</v-btn>
                </template>
              </stage-form>

              <competition-remove :competition="competition">
                <template #default="{ on }">
                  <v-btn
                    v-on="on"
                    dark
                  >Remove</v-btn>
                </template>
              </competition-remove>
            </v-flex>
          </v-layout>

        </material-card>
      </v-flex>

      <!-- Table Stages -->
      <v-flex
        v-if="tables.length > 0"
        xs12
      >
        <v-expansion-panels>
          <competition-table
            v-for="(table, i) in tables"
            :key="i"
            :table="table"
            :readonly="readonly"
          />
        </v-expansion-panels>
      </v-flex>

      <!-- Elimination Round Stages -->
      <v-flex
        v-if="rounds.length > 0"
        xs12
      >
        <competition-round
          v-for="(round, i) in rounds"
          :key="i"
          :round="round"
          :readonly="readonly"
        />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import { Competition } from '@/models'
  import MaterialCard from '@/helpers/theme/Card'
  import EditCompetitionForm from '@/components/Competition/EditCompetitionForm'
  import CompetitionCloseForm from '@/components/Competition/CompetitionCloseForm'
  import CompetitionTable from '@/components/Competition/CompetitionTable'
  import CompetitionRound from '@/components/Competition/CompetitionRound'
  import CompetitionRemove from '@/components/Competition/CompetitionRemove'
  import StageForm from '@/components/Competition/StageForm'
  import { TeamAccessible } from '@/mixins'

  export default {
    layout: 'team',
    middleware: 'authenticated',
    mixins: [
      TeamAccessible
    ],
    components: {
      MaterialCard,
      EditCompetitionForm,
      CompetitionCloseForm,
      CompetitionTable,
      CompetitionRound,
      CompetitionRemove,
      StageForm
    },
    data: () => ({
      stage: 0
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
    async fetch ({ store, params }) {
      await Promise.all([
        store.dispatch('competitions/GET', params),
        store.dispatch('stages/FETCH', params)
      ])
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
