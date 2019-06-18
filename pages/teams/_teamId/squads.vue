<template>
  <v-container
    fluid
    grid-list-lg
  >
    <v-layout wrap>
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
              outlined
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
  import { mixins, Component } from 'nuxt-property-decorator'
  import { TeamAccessible } from '@/mixins'
  import SquadForm from '@/components/Squad/Form'
  import SquadGrid from '@/components/Squad/Grid'

  @Component({
    components: {
      SquadForm,
      SquadGrid
    }
  })
  export default class SquadsPage extends mixins(TeamAccessible) {
    layout = () => 'default'
    middleware = () => 'authenticated'

    head () {
      return {
        title: `${this.team.title} - Squads`
      }
    }

    mounted () {
      this.$store.commit('app/SET_TITLE', this.team.title)
    }
  }
</script>
