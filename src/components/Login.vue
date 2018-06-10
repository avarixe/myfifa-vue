<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md6>
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
      </v-flex>
    </v-layout>
  </v-container>
</template>


<script>
  import { mapActions } from 'vuex'

  export default {
    data: () => ({
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
    }),
    methods: {
      ...mapActions({
        logUserIn: 'user/logUserIn',
        getUser: 'user/getInfo'
      }),
      logIn () {
        this.logUserIn(this.credentials)
          .then(() => {
            this.$router.push('/teams')
          })
          .catch((error) => {
            this.errorMessage = error.message
            this.loginError = true
          })
      }
    }
  }
</script>