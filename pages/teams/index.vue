<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <team-form>
          <template #default="{ on }">
            <v-btn
              color="blue-grey"
              outlined
              v-on="on"
            >
              <v-icon left>mdi-plus-circle-outline</v-icon>
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
  import { Vue, Component } from 'nuxt-property-decorator'
  import { Team } from '@/models'
  import TeamForm from '@/components/Team/Form'
  import TeamGrid from '@/components/Team/Grid'

  @Component({
    components: {
      TeamForm,
      TeamGrid
    },
    transition: 'fade-transition'
  })
  export default class TeamsPage extends Vue {
    layout = () => 'default'
    middleware = () => 'home'

    async fetch ({ store }) {
      await store.dispatch('teams/FETCH')
    }

    beforeMount () {
      this.$store.commit('app/SET_PAGE', {
        headline: 'Teams'
      })
    }
  }
</script>
