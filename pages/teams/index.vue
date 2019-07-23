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
              color="blue-grey"
              outlined
              v-on="on"
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
    },
    transition: 'fade-transition'
  })
  export default class TeamsPage extends Vue {
    layout = () => 'default'
    middleware = () => 'home'

    mounted () {
      this.$store.commit('app/SET_TITLE', 'Teams')
    }
  }
</script>
