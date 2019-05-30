<template>
  <v-container
    fluid
    grid-list-lg
  >
    <v-layout
      row
      wrap
    >
      <v-flex xs12>
        <div class="overline">{{ team.title }}</div>
        <div class="headline font-weight-thin">Squads</div>
      </v-flex>

      <v-flex xs12>
        <squad-form>
          <template #default="{ on }">
            <v-btn
              v-on="on"
              color="blue-grey"
              outline
            >
              <v-icon left>mdi-plus-circle-outline</v-icon>
              Squad
            </v-btn>
          </template>
        </squad-form>
      </v-flex>

      <v-flex xs12>
        <squad-grid />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import { TeamAccessible } from '@/mixins'
  import SquadForm from '@/components/Squad/SquadForm'
  import SquadGrid from '@/components/Squad/SquadGrid'

  export default {
    layout: 'team',
    middleware: 'authenticated',
    mixins: [
      TeamAccessible
    ],
    head () {
      return {
        title: `${this.team.title} - Squads`
      }
    },
    components: {
      SquadForm,
      SquadGrid
    },
    mounted () {
      this.$store.commit('app/SET_TITLE', this.team.title)
    }
  }
</script>
