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
              <v-flex xs12>
                <competition-form
                  :initial-competition="competition"
                  color="orange">
                  <v-btn dark color="orange">Edit</v-btn>
                </competition-form>
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
            <competition-table
              v-for="(table, i) in tables"
              :key="i"
              :table="table"
            ></competition-table>
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
            ></competition-round>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import { mapState } from 'vuex'
  import CompetitionForm from '@/components/Competition/CompetitionForm'
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
      CompetitionForm,
      CompetitionTable,
      CompetitionRound,
      CompetitionRemove,
      StageForm
    },
    data () {
      return {
      }
    },
    computed: {
      ...mapState('competition', { competitions: 'list' }),
      competition () {
        return this.competitions[this.$route.params.id]
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
      }
    },
    async fetch ({ store, params }) {
      const { data } = await store.dispatch('competition/get', { competitionId: params.id })
      await Promise.all([
        store.dispatch('team/get', { teamId: data.team_id, activate: true }),
        store.dispatch('stage/getAll', { competitionId: data.id })
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
    },
    methods: {
    }
  }
</script>
