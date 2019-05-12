<template>
  <v-form
    ref="form"
    @submit.prevent="authenticate"
  >
    <v-card>
      <v-card-title>MyFIFA Manager</v-card-title>
      <v-card-text>
        <v-flex xs12>
          <v-text-field
            v-model="credentials.username"
            label="Username"
            autofocus
            autocapitalize="off"
          />
        </v-flex>
        <v-flex xs12>
          <v-text-field
            v-model="credentials.password"
            label="Password"
            :type="visible ? 'text' : 'password'"
            :append-icon="`mdi-eye${visible ? '-off' : ''}`"
            @click:append="visible = !visible"
          />
        </v-flex>
      </v-card-text>

      <v-alert
        type="error"
        v-model="formError"
        dismissible
      >{{ errorMessage }}</v-alert>

      <v-card-actions>
        <v-spacer/>
        <user-form>
          <template #default="{ on }">
            <v-btn
              v-on="on"
              color="orange"
              flat
              large
            >Register</v-btn>
          </template>
        </user-form>

        <v-btn
          type="submit"
          color="primary"
          flat
          large
          :loading="loading"
          @click="loading = true"
        >Log In</v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script>
  import { mapActions } from 'vuex'
  import Cookie from 'js-cookie'
  import UserForm from '@/components/App/UserForm'

  export default {
    components: {
      UserForm
    },
    data: () => ({
      visible: false,
      loading: false,
      errorMessage: '',
      credentials: {
        username: '',
        password: '',
        grant_type: 'password'
      }
    }),
    computed: {
      formError: {
        get: function () { return this.errorMessage.length > 0 },
        set: function (val) { this.errorMessage = val }
      }
    },
    methods: {
      ...mapActions([
        'login'
      ]),
      async authenticate () {
        try {
          const { data } = await this.login(this.credentials)
          Cookie.set('token', data.access_token, {
            expires: data.expires_in / 86400
          })
        } catch (e) {
          this.errorMessage = e.message
        } finally {
          this.loading = false
        }
      }
    }
  }
</script>
