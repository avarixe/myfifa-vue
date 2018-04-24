<template>
  <v-container>
    <v-layout row justify-content>
      <v-dialog persistent v-model="notLoggedIn" max-width="500px">
        <v-form v-model="valid" @submit.prevent="logIn">
          <v-card>
            <v-card-title primary-title>
              <div class="headline">Log In</div>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12>
                    <v-alert
                      type="error"
                      v-model="loginError"
                      dismissible
                    >
                      {{ errorMessage }}
                    </v-alert>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field
                      v-model="credentials.email"
                      :rules="emailRules"
                      label="Email"
                      type="email"
                      autofocus
                      required
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field
                      v-model="credentials.password"
                      :rules="passwordRules"
                      label="Password"
                      type="password"
                      required
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn type="submit" :disabled="!valid" flat large>Log In</v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-dialog>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    data () {
      return {
        valid: false,
        emailRules: [
          v => !!v || 'Email is required'
        ],
        passwordRules: [
          v => !!v || 'Password is required'
        ],
        loginError: false,
        errorMessage: '',
        credentials: {
          email: '',
          password: '',
          grant_type: 'password'
        }
      }
    },
    computed: {
      notLoggedIn () {
        return !this.$store.state.user.token
      }
    },
    methods: {
      logIn () {
        this.$store.dispatch('user/logUserIn', this.credentials)
          .then(() => {
            this.dialog = false
          })
          .catch((error) => {
            this.errorMessage = error.message
            this.loginError = true
          })
      }
    }
  }
</script>