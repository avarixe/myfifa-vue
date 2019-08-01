<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <div class="overline">{{ team.title }}</div>
        <div class="headline font-weight-thin">Seasons</div>
      </v-col>
      <v-col cols="12">
        <competition-form>
          <template #default="{ on }">
            <v-btn
              color="blue-grey"
              outlined
              v-on="on"
            >
              <v-icon left>mdi-plus-circle-outline</v-icon>
              Competition
            </v-btn>
          </template>
        </competition-form>
      </v-col>

      <v-col cols="12">
        <season-grid />
      </v-col>
    </v-row>
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

    async fetch ({ store, params }) {
      await store.dispatch('competitions/FETCH', { teamId: params.teamId })
    }

    mounted () {
      this.$store.commit('app/SET_TITLE', this.team.title)
    }
  }
</script>
