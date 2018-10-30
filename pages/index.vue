<template>
  <v-container grid-list-lg>
    <v-layout row wrap>
      <template v-if="authenticated">
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
      </template>
      <template v-else>
        <v-flex xs12>
          <login-form color="blue"></login-form>
        </v-flex>
        <v-flex xs12>
          <user-form>
            <v-btn color="orange" dark large>Register</v-btn>
          </user-form>
        </v-flex>
      </template>
    </v-layout>
  </v-container>
</template>

<script>
  import { mapGetters } from 'vuex'
  import LoginForm from '@/components/LoginForm'
  import UserForm from '@/components/UserForm'
  import TeamForm from '@/components/Team/TeamForm'
  import TeamPanel from '@/components/Team/TeamPanel'

  export default {
    layout: 'default',
    components: {
      LoginForm,
      UserForm,
      TeamForm,
      TeamPanel
    },
    computed: mapGetters([ 'authenticated' ])
  }
</script>
