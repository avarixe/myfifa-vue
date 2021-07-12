<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <team-form>
          <template #default="{ on }">
            <v-btn v-on="on">
              <v-icon left>mdi-plus</v-icon>
              Team
            </v-btn>
          </template>
        </team-form>
      </v-col>
      <v-col cols="12">
        <team-grid />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { mapMutations, mapActions } from 'vuex'

  export default {
    name: 'TeamsPage',
    async fetch () {
      this.setPage({
        headline: 'Teams'
      })
      await this.fetchTeams()
    },
    methods: {
      ...mapMutations('app', {
        setPage: 'setPage'
      }),
      ...mapActions('teams', {
        fetchTeams: 'fetch'
      })
    }
  }
</script>
