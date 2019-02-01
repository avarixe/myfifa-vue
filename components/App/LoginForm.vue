<template>
  <v-form
    ref="form"
    @submit.prevent="authenticate"
  >
    <v-card>
      <v-card-title
        v-text="'MyFIFA Manager'"
      />
      <v-card-text>
        <v-flex
          xs12
        >
          <v-text-field
            v-model="credentials.username"
            label="Username"
            autofocus
            autocapitalize="off"
          />
        </v-flex>
        <v-flex
          xs12
        >
          <v-text-field
            v-model="credentials.password"
            label="Password"
            :type="visible ? 'text' : 'password'"
            :append-icon="`mdi-eye${visible ? '-off' : ''}`"
            @click:append="visible = !visible"
          />
        </v-flex>
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <user-form>
          <v-btn
            color="orange"
            flat
            large
            v-text="'Register'"
          />
        </user-form>

        <v-btn
          type="submit"
          color="primary"
          flat
          large
          v-text="'Log In'"
        />
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script>
  import Cookie from 'js-cookie'
  import UserForm from '@/components/App/UserForm'

  export default {
    components: {
      UserForm
    },
    data: () => ({
      visible: false,
      credentials: {
        username: '',
        password: '',
        grant_type: 'password'
      }
    }),
    methods: {
      async authenticate () {
        const { data } = await this.$store.dispatch('login', this.credentials)
        Cookie.set('token', data.access_token, data.expires_in / 86400)
      }
    }
  }
</script>
