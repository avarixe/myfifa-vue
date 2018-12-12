<template>
  <v-container grid-list-lg>
    <v-layout row wrap>
      <v-flex xs12>
        <team-form>
          <v-btn>
            <v-icon left>mdi-plus-circle-outline</v-icon>
            Team
          </v-btn>
        </team-form>
      </v-flex>
      <v-flex xs12>
        <team-panel></team-panel>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import TeamForm from '@/components/Team/TeamForm'
  import TeamPanel from '@/components/Team/TeamPanel'

  export default {
    layout: 'default',
    middleware: 'home',
    components: {
      TeamForm,
      TeamPanel
    }
  }
</script>
