<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <div class="overline">{{ team.title }}</div>
        <div class="headline font-weight-thin">Players</div>
      </v-col>

      <v-col cols="12">
        <player-form />
      </v-col>

      <v-col cols="12">
        <player-grid />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { mixins, Component } from 'nuxt-property-decorator'
  import { TeamAccessible } from '@/mixins'
  import PlayerForm from '@/components/Player/Form'
  import PlayerGrid from '@/components/Player/Grid'

  @Component({
    components: {
      PlayerForm,
      PlayerGrid
    },
    transition: 'fade-transition'
  })
  export default class PlayersPage extends mixins(TeamAccessible) {
    layout = () => 'default'
    middleware = () => 'authenticated'

    head () {
      return {
        title: `${this.team.title} - Players`
      }
    }

    async fetch ({ store, params }) {
      await Promise.all([
        store.dispatch('players/FETCH', { teamId: params.teamId }),
        store.dispatch('contracts/TEAM_FETCH', { teamId: params.teamId })
      ])
    }

    mounted () {
      this.$store.commit('app/SET_TITLE', this.team.title)
    }
  }
</script>
