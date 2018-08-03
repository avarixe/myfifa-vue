<template>
  <v-container fluid fill-height>
    <v-layout justify-center>
      <v-flex xs12>
        <v-card>
          <v-card-text>
            <v-jumbotron>
              <h3 class="display-3">Welcome to MyFIFA Manager</h3>
              <v-divider class="my-3"></v-divider>
              <v-btn
                v-if="authenticated"
                class="mx-0"
                color="primary"
                large
                nuxt
                to="/teams">
                Teams
              </v-btn>
              <div v-else>
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
            </v-jumbotron>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import { mapGetters } from 'vuex'
  import LoginForm from '@/components/LoginForm'
  import UserForm from '@/components/UserForm'

  export default {
    components: {
      'login-form': LoginForm,
      'user-form': UserForm
    },
    computed: mapGetters([ 'authenticated' ])
  }
</script>
