<template>
  <v-container grid-list-lg>
    <v-layout wrap>
      <v-flex xs12>
        <div class="headline font-weight-thin">Teams</div>
      </v-flex>

      <v-flex xs12>
        <team-form>
          <template #default="{ on }">
            <v-btn
              v-on="on"
              color="blue-grey"
              outlined
            >
              <v-icon left>mdi-plus-circle-outline</v-icon>
              Team
            </v-btn>
          </template>
        </team-form>
      </v-flex>

      <v-flex xs12>
        <team-grid />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import TeamForm from '@/components/Team/TeamForm'
  import TeamGrid from '@/components/Team/TeamGrid'

  export default {
    layout: 'default',
    middleware: 'home',
    components: {
      TeamForm,
      TeamGrid
    },
    mounted () {
      this.$store.commit('app/SET_TITLE', 'Teams')
    }
  }
</script>
