<template>
  <v-container
    fluid
    grid-list-lg
  >
    <v-layout wrap>
      <v-flex xs12>
        <div class="overline">{{ team.title }}</div>
        <div class="headline font-weight-thin">Seasons</div>
      </v-flex>
      <v-flex xs12>
        <competition-form>
          <template #default="{ on }">
            <v-btn
              v-on="on"
              color="blue-grey"
              outlined
            >
              <v-icon left>mdi-plus-circle-outline</v-icon>
              Competition
            </v-btn>
          </template>
        </competition-form>
      </v-flex>

      <v-flex xs12>
        <season-grid />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import { mixins, Component } from 'nuxt-property-decorator'
  import { TeamAccessible } from '@/mixins'
  import SeasonGrid from '@/components/Season/Grid'
  import CompetitionForm from '@/components/Competition/Form'

  @Component({
    components: {
      CompetitionForm,
      SeasonGrid
    },
    transition: 'fade-transition'
  })
  export default class SeasonsPage extends mixins(TeamAccessible) {
    layout = () => 'default'
    middleware = () => 'authenticated'

    head () {
      return {
        title: `${this.team.title} - Seasons`
      }
    }

    mounted () {
      this.$store.commit('app/SET_TITLE', this.team.title)
    }
  }
</script>
