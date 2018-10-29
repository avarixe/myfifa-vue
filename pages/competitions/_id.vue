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
                <competition-remove :competition="competition">
                  <v-btn dark>Remove</v-btn>
                </competition-remove>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import { mapState } from 'vuex'
  import CompetitionForm from '@/components/Competition/CompetitionForm'
  import CompetitionRemove from '@/components/Competition/CompetitionRemove'
  import TeamAccessible from '@/mixins/TeamAccessible'

  export default {
    layout: 'team',
    components: {
      CompetitionForm,
      CompetitionRemove
    },
    middleware: 'authenticated',
    mixins: [ TeamAccessible ],
    data () {
      return {
      }
    },
    computed: {
      ...mapState('competition', { competitions: 'list' }),
      competition () {
        return this.competitions[this.$route.params.id]
      }
    },
    async fetch ({ store, params }) {
      const { data } = await store.dispatch('competition/get', { competitionId: params.id })
      await Promise.all([
        store.dispatch('team/get', { teamId: data.team_id, activate: true })
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
