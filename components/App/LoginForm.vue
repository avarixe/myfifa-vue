<template>
  <base-form :submit="login">
    <template #default="{ loading }">
      <v-card>
        <v-toolbar flat>
          <v-toolbar-title>
            <div class="text-h5 font-weight-light">MyFIFA Manager</div>
            <div class="text-caption">v{{ version }}</div>
          </v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-row dense>
            <v-col cols="12">
              <v-text-field
                v-model="credentials.username"
                label="Username"
                autofocus
                autocapitalize="off"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="credentials.password"
                label="Password"
                :type="visible ? 'text' : 'password'"
                :append-icon="`mdi-eye${visible ? '' : '-off'}`"
                @click:append="visible = !visible"
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-alert
          v-model="error"
          type="error"
          dismissible
          v-text="errorMessage"
        />
        <v-card-actions>
          <v-spacer />
          <user-form>
            <template #default="{ on }">
              <v-btn
                color="orange"
                text
                large
                v-on="on"
                v-text="'Register'"
              />
            </template>
          </user-form>
          <v-btn
            type="submit"
            color="primary"
            text
            large
            :loading="loading"
          >
            Log In
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </base-form>
</template>

<script>
  import { mapState, mapActions } from 'vuex'

  export default {
    name: 'LoginForm',
    data: () => ({
      credentials: {
        username: '',
        password: '',
        grant_type: 'password'
      },
      error: false,
      errorMessage: null,
      visible: false
    }),
    computed: mapState([
      'version'
    ]),
    methods: {
      ...mapActions('auth', [
        'createToken'
      ]),
      async login () {
        try {
          this.error = false
          this.errorMessage = null
          await this.createToken(this.credentials)
        } catch ({ response }) {
          this.error = true
          this.errorMessage = response
            ? 'Invalid Username/Password. Please try again.'
            : 'API is not enabled.'
        }
      }
    }
  }
</script>
