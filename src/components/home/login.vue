<template>
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
              label="Email"
              type="email"
              autofocus
            ></v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-text-field
              v-model="credentials.password"
              label="Password"
              :type="visible ? 'text' : 'password'"
              :append-icon="visible ? 'visibility_off' : 'visibility'"
              @click:append="visible = !visible"
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
</template>


<script>
  import { mapActions } from 'vuex'

  export default {
    data: () => ({
      valid: false,
      errorMessage: '',
      visible: false,
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
      ...mapActions('user', [
        'login',
        'info'
      ]),
      authenticate () {
        this.login(this.credentials)
          .then((data) => { this.$router.push('/teams') })
          .catch((error) => { this.errorMessage = error.message })
      }
    }
  }
</script>