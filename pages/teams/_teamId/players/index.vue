<template>
  <v-container
    fluid
    grid-list-lg
  >
    <v-layout wrap>
      <v-flex xs12>
        <div class="overline">{{ team.title }}</div>
        <div class="headline font-weight-thin">Players</div>
      </v-flex>

      <v-flex xs12>
        <player-form />
      </v-flex>

      <v-flex xs12>
        <player-grid />
      </v-flex>
    </v-layout>
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
    }
  })
  export default class PlayersPage extends mixins(TeamAccessible) {
    layout = () => 'default'
    middleware = () => 'authenticated'

    head () {
      return {
        title: `${this.team.title} - Players`
      }
    }

    mounted () {
      this.$store.commit('app/SET_TITLE', this.team.title)
    }
  }
</script>
