<template>
  <v-container fluid grid-list-lg>
    <v-layout row wrap>
      <v-flex xs12 class="text-xs-center text-sm-left">
        <team-form formTitle="New Team">
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
            <div class="headline">{{ team.title }}</div>
            <v-flex xs12>{{ team.time_period }}</v-flex>
          </v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-tooltip bottom>
              <v-btn icon @click.native="set(team.id)" slot="activator">
                <v-icon color="blue">
                  radio_button_{{ team.id == activeId ? 'checked' : 'unchecked' }}
                </v-icon>
              </v-btn>
              <span>Set as Active</span>
            </v-tooltip>
            <team-form :teamId="team.id" :formTitle="'Edit ' + team.title">
              <v-tooltip bottom>
                <v-btn icon slot="activator">
                  <v-icon>edit</v-icon>
                </v-btn>
                <span>Edit</span>
              </v-tooltip>
            </team-form>
            <v-tooltip bottom>
              <v-btn icon slot="activator" @click.native="teamToDelete = team.id">
                <v-icon color="red">cancel</v-icon>
              </v-btn>
              <span>Remove</span>
            </v-tooltip>
          </v-card-actions>
        </v-card>
        <v-snackbar
          color="red"
          v-model="teamToDelete === team.id">
          Delete {{ team.title }}?
          <v-btn dark flat @click.native="deleteTeam(teamToDelete)">Yes</v-btn>
          <v-btn dark flat @click.native="teamToDelete = ''">No</v-btn>
        </v-snackbar>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import { mapGetters, mapMutations, mapActions } from 'vuex'
  import TeamForm from '@/components/Teams/TeamForm'

  export default {
    data: () => ({
      teamToDelete: ''
    }),
    computed: mapGetters({
      activeId: 'team/activeId',
      teams: 'team/list'
    }),
    methods: {
      ...mapMutations({
        set: 'team/set'
      }),
      ...mapActions({
        refresh: 'team/refresh',
        delete: 'team/delete'
      }),
      deleteTeam (teamId) {
        this.delete(teamId)
          .then((data) => { this.teamToDelete = '' })
          .catch((error) => { alert(error) })
      }
    },
    mounted () {
      this.refresh()
        .catch((error) => { alert(error.message) })
    },
    components: {
      'team-form': TeamForm
    }
  }
</script>