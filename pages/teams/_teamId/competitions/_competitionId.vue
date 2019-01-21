<template>
  <v-container
    fluid
    grid-list-lg
  >
    <v-layout
      row
      wrap
    >
      <v-flex
        xs12
      >
        <material-card>
          <template
            slot="header"
          >
            <v-layout
              class="text-xs-center"
              row
              wrap
            >
              <v-flex
                xs12
              >
                <div
                  class="subheading"
                  v-text="seasonLabel(competition.season)"
                />
                <div
                  class="display-1"
                  v-text="competition.name"
                />
              </v-flex>
            </v-layout>
          </template>

          <v-layout
            class="text-xs-center"
            row
            wrap
          >
            <v-flex
              v-if="competition.champion"
              xs12
            >
              <div
                class="title"
              >
                <v-icon
                  color="yellow darken-2"
                  left
                  v-text="'mdi-crown'"
                />
                {{ competition.champion }}
                <v-icon
                  color="yellow darken-2"
                  right
                  v-text="'mdi-crown'"
                />
              </div>
            </v-flex>

            <v-flex
              v-if="!readonly"
              xs12
            >
              <edit-competition-form
                :competition-data="competition"
                color="orange"
              >
                <v-btn
                  dark
                  color="orange"
                  v-text="'Edit'"
                />
              </edit-competition-form>
              <stage-form
                :competition="competition"
                color="teal"
              >
                <v-btn
                  dark
                  color="teal"
                  v-text="'Add Stage'"
                />
              </stage-form>
              <competition-remove
                :competition="competition"
              >
                <v-btn
                  dark
                  v-text="'Remove'"
                />
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
        <v-expansion-panel
          v-model="stage"
          popout
        >
          <competition-table
            v-for="(table, i) in tables"
            :key="i"
            :table="table"
            :readonly="readonly"
          />
        </v-expansion-panel>
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
  import MaterialCard from '@/components/theme/Card'
  import EditCompetitionForm from '@/components/Competition/EditCompetitionForm'
  import CompetitionTable from '@/components/Competition/CompetitionTable'
  import CompetitionRound from '@/components/Competition/CompetitionRound'
  import CompetitionRemove from '@/components/Competition/CompetitionRemove'
  import StageForm from '@/components/Competition/StageForm'
  import TeamAccessible from '@/mixins/TeamAccessible'

  export default {
    layout: 'team',
    middleware: 'authenticated',
    mixins: [ TeamAccessible ],
    components: {
      MaterialCard,
      EditCompetitionForm,
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
        title: `${this.competition.name} (${this.seasonLabel(this.competition.season)})`
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
      tables () { return this.stages.filter(stage => stage.table) },
      rounds () { return this.stages.filter(stage => !stage.table) },
      readonly () { return this.competition.season !== this.season }
    },
    async fetch ({ store, params }) {
      await Promise.all([
        store.dispatch('entities/competitions/GET', params),
        store.dispatch('entities/stages/FETCH', params)
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
