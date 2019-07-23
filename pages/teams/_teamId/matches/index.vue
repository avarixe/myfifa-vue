<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <div class="overline">{{ team.title }}</div>
        <div class="headline font-weight-thin">Matches</div>
      </v-col>

      <v-col cols="12">
        <match-form />
      </v-col>

      <v-col cols="12">
        <match-grid />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { mixins, Component } from 'nuxt-property-decorator'
  import { TeamAccessible } from '@/mixins'
  import MatchForm from '@/components/Match/Form'
  import MatchGrid from '@/components/Match/Grid'

  @Component({
    components: {
      MatchForm,
      MatchGrid
    },
    transition: 'fade-transition'
  })
  export default class MatchesPage extends mixins(TeamAccessible) {
    layout = () => 'default'
    middleware = () => 'authenticated'

    head () {
      return {
        title: `${this.team.title} - Matches`
      }
    }

    mounted () {
      this.$store.commit('app/SET_TITLE', this.team.title)
    }
  }
</script>
