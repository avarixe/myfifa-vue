<template>
  <v-container fluid grid-list-lg>
    <v-layout row wrap>
      <v-flex xs12>
        <squad-form>
          <v-btn>
            <v-icon left>mdi-plus-circle-outline</v-icon>
            Squad
          </v-btn>
        </squad-form>
      </v-flex>
      <v-flex xs12>
        <squad-grid></squad-grid>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import TeamAccessible from '@/mixins/TeamAccessible'
  import SquadForm from '@/components/Squad/SquadForm'
  import SquadGrid from '@/components/Squad/SquadGrid'

  export default {
    layout: 'team',
    middleware: 'authenticated',
    mixins: [ TeamAccessible ],
    head () {
      return {
        title: this.title
      }
    },
    components: {
      SquadForm,
      SquadGrid
    },
    computed: {
      title () {
        return `${this.team.title} - Squads`
      }
    },
    mounted () {
      this.$store.commit('app/SET_TITLE', this.team.title)
    }
  }
</script>
