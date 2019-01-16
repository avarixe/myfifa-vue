<template>
  <v-container fluid grid-list-lg>
    <v-layout row wrap>
      <v-flex xs12>
        <player-form>
          <v-btn>
            <v-icon left>mdi-plus-circle-outline</v-icon>
            Player
          </v-btn>
        </player-form>
      </v-flex>
      <v-flex xs12>
        <player-grid></player-grid>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import TeamAccessible from '@/mixins/TeamAccessible'
  import PlayerForm from '@/components/Player/PlayerForm'
  import PlayerGrid from '@/components/Player/PlayerGrid'

  export default {
    layout: 'team',
    middleware: 'authenticated',
    mixins: [ TeamAccessible ],
    components: {
      PlayerForm,
      PlayerGrid
    },
    head () {
      return {
        title: `${this.team.title} - Players`
      }
    },
    mounted () {
      this.$store.commit('app/SET_TITLE', this.team.title)
    }
  }
</script>
