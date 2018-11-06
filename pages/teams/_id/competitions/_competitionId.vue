<template>
  <v-container fluid grid-list-lg>
    <v-layout row wrap>
      <v-flex xs12>
        <v-card>
          <v-card-text>
            <v-layout class="text-xs-center" row wrap>
              <v-flex xs12>
                <div class="subheading">{{ seasonLabel(competition.season) }}</div>
                <div class="display-1">{{ competition.name }}</div>
              </v-flex>
              <v-flex v-if="competition.champion" xs12>
                <div class="title">
                  <v-icon color="yellow darken-2" left>mdi-crown</v-icon>
                  {{ competition.champion }}
                  <v-icon color="yellow darken-2" right>mdi-crown</v-icon>
                </div>
              </v-flex>
              <v-flex v-if="!readonly" xs12>
                <edit-competition-form
                  :competition-data="competition"
                  color="orange">
                  <v-btn dark color="orange">Edit</v-btn>
                </edit-competition-form>
                <stage-form :competition="competition" color="teal">
                  <v-btn dark color="teal">Add Stage</v-btn>
                </stage-form>
                <competition-remove :competition="competition">
                  <v-btn dark>Remove</v-btn>
                </competition-remove>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>

      <!-- Table Stages -->
      <v-flex v-if="tables.length > 0" xs12>
        <v-card>
          <v-card-text>
            <v-expansion-panel v-model="stage" popout>
              <competition-table
                v-for="(table, i) in tables"
                :key="i"
                :table="table"
                :readonly="readonly"
              ></competition-table>
            </v-expansion-panel>
          </v-card-text>
        </v-card>
      </v-flex>

      <!-- Elimination Round Stages -->
      <v-flex v-if="rounds.length > 0" xs12>
        <v-card>
          <v-card-text>
            <competition-round
              v-for="(round, i) in rounds"
              :key="i"
              :round="round"
              :readonly="readonly"
            ></competition-round>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import { mapState, mapGetters } from 'vuex'
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
      EditCompetitionForm,
      CompetitionTable,
      CompetitionRound,
      CompetitionRemove,
      StageForm
    },
    data () {
      return {
        stage: 0
      }
    },
    computed: {
      ...mapState('competition', { competitions: 'list' }),
      ...mapGetters('team', ['season']),
      competition () {
        return this.competitions[this.$route.params.competitionId]
      },
      stages () {
        return 'stages' in this.competition
          ? Object.values(this.competition.stages)
          : []
      },
      tables () {
        return this.stages.filter(stage => stage.table)
      },
      rounds () {
        return this.stages.filter(stage => !stage.table)
      },
      readonly () {
        return this.competition.season !== this.season
      }
    },
    async fetch ({ store, params }) {
      await Promise.all([
        (async () => {
          store.state.team.currentId !== params.id &&
          await store.dispatch('team/get', { teamId: params.id, activate: true })
        })(),
        (async () => {
          !(params.competitionId in store.state.competition.list) &&
          await store.dispatch('competition/get', { competitionId: params.competitionId })
          await store.dispatch('stage/getAll', { competitionId: params.competitionId })
        })(),
      ])
    },
    mounted () {
    },
    watch: {
      competition (val) {
        !val && this.$router.push({
          name: 'teams-id',
          id: this.team.id
        })
      }
    }
  }
</script>
