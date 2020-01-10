<template lang="pug">
  v-form(ref="form" @submit.prevent="authenticate")
    v-card
      v-toolbar(flat)
        v-toolbar-title
          .headline.font-weight-light MyFIFA Manager
          .caption v{{ version }}
      v-card-text
        dynamic-fields(:object="credentials" :fields="fields")
      v-alert(v-model="formError" type="error" dismissible) {{ errorMessage }}
      v-card-actions
        v-spacer
        user-form
          template(#default="{ on }")
            v-btn(
              color="orange"
              text
              large
              v-on="on"
            ) Register
        v-btn(
          type="submit"
          color="primary"
          text
          large
          :loading="loading"
          @click="loading = true"
        ) Log In
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import Cookie from 'js-cookie'
  import UserForm from '@/components/App/UserForm'

  export default {
    name: 'LoginForm',
    components: {
      UserForm
    },
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
      ...mapActions([
        'login'
      ]),
      async authenticate () {
        try {
          const { data } = await this.login(this.credentials)
          Cookie.set('token', data.access_token, {
            expires: data.expires_in / 86400
          })
          this.$router.push({ name: 'teams' })
        } catch (e) {
          this.errorMessage = e.message
        } finally {
          this.loading = false
        }
      }
    }
  }
</script>
