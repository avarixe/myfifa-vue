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
  import { Vue, Component, State, Action } from 'nuxt-property-decorator'
  import Cookie from 'js-cookie'
  import { DynamicFields } from '@/helpers'
  import UserForm from '@/components/App/UserForm'

  @Component({
    components: {
      DynamicFields,
      UserForm
    }
  })
  export default class LoginForm extends Vue {
    @State version
    @Action login

    loading = false
    errorMessage = ''
    credentials = {
      username: '',
      password: '',
      grant_type: 'password'
    }

    get fields () {
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
