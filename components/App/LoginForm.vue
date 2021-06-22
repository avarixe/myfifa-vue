<template>
  <v-form
    ref="form"
    @submit.prevent="authenticate"
  >
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
        v-model="formError"
        type="error"
        dismissible
      >
        {{ errorMessage }}
      </v-alert>
      <v-card-actions>
        <v-spacer />
        <user-form>
          <template #default="{ on }">
            <v-btn
              color="orange"
              text
              large
              v-on="on"
            >
              Register
            </v-btn>
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
  </v-form>
</template>

<script>
  import { mapState, mapActions } from 'vuex'

  export default {
    name: 'LoginForm',
    data: () => ({
      loading: false,
      errorMessage: '',
      credentials: {
        username: '',
        password: '',
        grant_type: 'password'
      },
      visible: false
    }),
    computed: {
      ...mapState([
        'version'
      ]),
      formError: {
        get () {
          return this.errorMessage.length > 0
        },
        set (val) {
          this.errorMessage = val
        }
      }
    },
    methods: {
      ...mapActions({
        login: 'login',
        getTeam: 'teams/get'
      }),
      async authenticate () {
        try {
          this.loading = true
          this.errorMessage = ''
          await this.login(this.credentials)

          // load Team if required
          if (this.$route.hash) {
            const matches = this.$route.hash.match(/teams\/(\d+)/)
            if (matches) {
              await this.getTeam({ teamId: matches[1] })
            }
          }

          this.$router.push(this.$route.hash.slice(1) || { name: 'teams' })
        } catch ({ response }) {
          this.errorMessage = response
            ? 'Invalid Username/Password. Please try again.'
            : 'API is not enabled.'
          this.loading = false
        }
      }
    }
  }
</script>
