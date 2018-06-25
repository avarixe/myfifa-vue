<template>
  <v-container fluid grid-list-lg>
    <v-layout row wrap>
      <v-flex xs12 class="text-xs-center text-sm-left">
        <team-form title="New Team">
          <v-btn color="secondary">New Team</v-btn>
        </team-form>
      </v-flex>
      <v-flex
        xs12
        sm6
        md4
        v-for="team in teams"
        :key="team.id">
        <v-card>
          <v-card-title primary-title>
            <div class="headline">
              {{ team.title }}
              <v-tooltip top color="primary">
                <v-btn icon slot="activator" :to="'/team/' + team.id">
                  <v-icon color="primary">arrow_forward</v-icon>
                </v-btn>
                <span>Team Dashboard</span>
              </v-tooltip>
            </div>
            <v-flex xs12>{{ team.time_period }}</v-flex>
          </v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <team-form :id="team.id" :title="'Edit ' + team.title">
              <v-tooltip bottom color="orange darken-2">
                <v-btn icon slot="activator">
                  <v-icon color="orange darken-2">edit</v-icon>
                </v-btn>
                <span>Edit</span>
              </v-tooltip>
            </team-form>
            <v-tooltip bottom color="red darken-2">
              <v-btn icon slot="activator" @click.native="teamToDelete = team.id">
                <v-icon color="red darken-2">cancel</v-icon>
              </v-btn>
              <span>Remove</span>
            </v-tooltip>
          </v-card-actions>
        </v-card>
        <v-snackbar
          color="red"
          v-model="teamToDelete === team.id">
          Remove {{ team.title }}?
          <v-btn dark flat @click.native="deleteTeam(teamToDelete)">Yes</v-btn>
          <v-btn dark flat @click.native="teamToDelete = ''">No</v-btn>
        </v-snackbar>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import { mapState, mapActions, mapMutations } from 'vuex'
  import TeamForm from '@/components/teams/form'

  export default {
    data: () => ({
      teamToDelete: 0
    }),
    computed: mapState('team', {
      teams: 'list'
    }),
    methods: {
      ...mapActions('team', [
        'refresh',
        'delete'
      ]),
      ...mapMutations('team', [
        'set'
      ]),
      deleteTeam (teamId) {
        this.delete(teamId)
          .then((data) => { this.teamToDelete = 0 })
          .catch((error) => { alert(error) })
      }
    },
    mounted () {
      this.set(null)
      this.refresh()
        .catch((error) => { alert(error.message) })
    },
    components: {
      'team-form': TeamForm
    }
  }
</script>