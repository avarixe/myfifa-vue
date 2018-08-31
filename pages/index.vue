<template>
  <v-container grid-list-lg>
    <v-layout row wrap>
      <v-flex xs12>
        <v-card>
          <v-card-text>
            <h3 class="display-3">Welcome to MyFIFA Manager</h3>
            <v-divider class="my-3"></v-divider>
            <div v-if="!authenticated">
              <login-form
                color="blue"
              ></login-form>
              <user-form>
                <v-btn
                  color="orange"
                  dark
                  large
                >Register</v-btn>
              </user-form>
            </div>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs12>
        <team-panel v-if="authenticated"></team-panel>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import { mapGetters } from 'vuex'
  import LoginForm from '@/components/LoginForm'
  import UserForm from '@/components/UserForm'
  import TeamPanel from '@/components/Team/TeamPanel'

  export default {
    layout: 'default',
    components: {
      LoginForm,
      UserForm,
      TeamPanel
    },
    computed: mapGetters([ 'authenticated' ])
  }
</script>
