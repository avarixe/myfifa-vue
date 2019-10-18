<template>
  <v-form
    ref="form"
    @submit.prevent="authenticate"
  >
    <v-card>
      <v-toolbar
        flat
      >
        <v-toolbar-title>
          <div class="headline font-weight-light">MyFIFA Manager</div>
          <div class="caption">v{{ version }}</div>
        </v-toolbar-title>
      </v-toolbar>

      <v-card-text>
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
            :append-icon="`mdi-eye${visible ? '-off' : ''}`"
            @click:append="visible = !visible"
          />
        </v-col>
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
  import { Vue, Component, State, Action } from 'nuxt-property-decorator'
  import Cookie from 'js-cookie'
  import UserForm from '@/components/App/UserForm'

  @Component({
    components: {
      UserForm
    }
  })
  export default class LoginForm extends Vue {
    @State version
    @Action login

    visible = false
    loading = false
    errorMessage = ''
    credentials = {
      username: '',
      password: '',
      grant_type: 'password'
    }

    get formError () {
      return this.errorMessage.length > 0
    }

    set formError (val) {
      this.errorMessage = val
    }

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
</script>
