<template>
  <v-container fluid fill-height>  
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md6>
        <v-form v-model="valid" @submit.prevent="authenticate">
          <v-card>
            <v-card-title primary-title>
              <div class="headline">Log In</div>
            </v-card-title>
            <v-card-text>
              <v-layout wrap>
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
            </v-card-text>
            <v-alert
              type="error"
              v-model="loginError"
              dismissible>
              {{ errorMessage }}
            </v-alert>
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
      errorMessage: '',
      credentials: {
        email: '',
        password: '',
        grant_type: 'password'
      }
    }),
    computed: {
      loginError: {
        get: function () { return this.errorMessage.length > 0 },
        set: function (val) { this.errorMessage = val }
      }
    },
    methods: {
      ...mapActions({
        login: 'user/login',
        info: 'user/info'
      }),
      authenticate () {
        this.login(this.credentials)
          .then((data) => { this.$router.push('/') })
          .catch((error) => { this.errorMessage = error.message })
      }
    }
  }
</script>