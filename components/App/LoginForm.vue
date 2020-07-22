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
        <dynamic-fields
          :object="credentials"
          :fields="fields"
        />
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
          @click="loading = true"
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
      }
    }),
    computed: {
      ...mapState([
        'version'
      ]),
      fields () {
        return [
          {
            type: 'string',
            attribute: 'username',
            label: 'Username',
            autofocus: true,
            autocapitalize: 'off'
          },
          {
            type: 'password',
            attribute: 'password',
            label: 'Password'
          }
        ]
      },
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
        login: 'LOGIN',
        getTeam: 'teams/GET'
      }),
      async authenticate () {
        try {
          await this.login(this.credentials)

          // load Team if required
          if (this.$route.hash) {
            const matches = this.$route.hash.match(/teams\/(\d+)/)
            if (matches) {
              await this.getTeam({ teamId: matches[1] })
            }
          }

          this.$router.push(this.$route.hash.slice(1) || { name: 'teams' })
        } catch (e) {
          this.errorMessage = e.message
          this.loading = false
        }
      }
    }
  }
</script>
