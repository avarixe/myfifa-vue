<template>
  <v-container grid-list-lg>
    <v-layout wrap>
      <v-flex xs12>
        <div class="headline font-weight-thin">Teams</div>
      </v-flex>

      <v-flex xs12>
        <team-form>
          <template #default="{ on }">
            <v-btn
              v-on="on"
              color="blue-grey"
              outlined
            >
              <v-icon left>mdi-plus-circle-outline</v-icon>
              Team
            </v-btn>
          </template>
        </team-form>
      </v-flex>

      <v-flex xs12>
        <team-grid />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import { Vue, Component } from 'nuxt-property-decorator'
  import TeamForm from '@/components/Team/Form'
  import TeamGrid from '@/components/Team/Grid'

  @Component({
    components: {
      TeamForm,
      TeamGrid
    }
  })
  export default class TeamsPage extends Vue {
    layout = () => 'default'
    middleware = () => 'home'

    mounted () {
      this.$store.commit('app/SET_TITLE', 'Teams')
    }
  }
</script>
