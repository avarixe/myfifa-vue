<template>
  <v-container fluid grid-list-lg>
    <v-layout row wrap>
      <v-flex xs12 class="text-xs-center text-sm-left">
        <team-form>
          <v-btn color="secondary">
            <v-icon left>add_circle_outline</v-icon>
            New Team
          </v-btn>
        </team-form>
      </v-flex>
      <v-flex
        xs12
        sm6
        md4
        v-for="(team, teamId) in teams"
        :key="team.id">
        <v-card>
          <v-card-title primary-title>
            <div class="headline">
              {{ team.title }}
              <v-btn icon slot="activator" nuxt :to="'/teams/' + team.id">
                <v-icon color="primary">arrow_forward</v-icon>
              </v-btn>
            </div>
            <v-flex xs12>{{ team.time_period }}</v-flex>
          </v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <team-form :initial-team="team" color="orange">
              <v-tooltip bottom color="orange darken-2">
                <v-btn icon slot="activator">
                  <v-icon color="orange darken-2">edit</v-icon>
                </v-btn>
                Edit
              </v-tooltip>
            </team-form>
            <v-tooltip bottom color="black">
              <v-btn icon slot="activator" @click.native="teamToDelete = team.id">
                <v-icon color="black">remove_circle</v-icon>
              </v-btn>
              Remove
            </v-tooltip>
          </v-card-actions>
        </v-card>
        <v-snackbar
          color="black"
          v-model="teamToDelete === team.id">
          Remove Team: {{ team.title }}?
          <v-btn dark flat @click.native="deleteTeam(teamToDelete)">Yes</v-btn>
          <v-btn dark flat @click.native="teamToDelete = ''">No</v-btn>
        </v-snackbar>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import TeamForm from '@/components/Team/TeamForm'

  export default {
    components: {
      'team-form': TeamForm
    },
    middleware: 'authenticated',
    data: () => ({
      teamToDelete: 0
    }),
    computed: mapState('team', {
      teams: 'list'
    }),
    async fetch ({ store }) {
      await store.dispatch('team/refresh')
    },
    beforeMount () {
      this.$store.commit('team/clear')
    },
    methods: {
      ...mapActions('team', [
        'remove'
      ]),
      async deleteTeam (teamId) {
        try {
          await this.remove(teamId)
          this.teamToDelete = 0
        } catch (e) {
          alert(e)
        }
      }
    }
  }
</script>
