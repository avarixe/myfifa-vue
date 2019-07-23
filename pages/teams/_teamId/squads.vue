<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <div class="overline">{{ team.title }}</div>
        <div class="headline font-weight-thin">Squads</div>
      </v-col>

      <v-col cols="12">
        <squad-form>
          <template #default="{ on }">
            <v-btn
              color="blue-grey"
              outlined
              v-on="on"
            >
              <v-icon left>mdi-plus-circle-outline</v-icon>
              Squad
            </v-btn>
          </template>
        </squad-form>
      </v-col>

      <v-col cols="12">
        <squad-grid />
      </v-col>
    </v-row>
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
    },
    transition: 'fade-transition'
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
