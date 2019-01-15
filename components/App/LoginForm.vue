<template>
  <v-form ref="form" @submit.prevent="authenticate">
    <v-card>
      <v-card-title>
        MyFIFA Manager
      </v-card-title>
      <v-card-text>
        <v-flex xs12>
          <v-text-field
            v-model="credentials.username"
            label="Username"
            autofocus
          ></v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-text-field
            v-model="credentials.password"
            label="Password"
            :type="visible ? 'text' : 'password'"
            :append-icon="`mdi-eye${visible ? '-off' : ''}`"
            @click:append="visible = !visible"
          ></v-text-field>
        </v-flex>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <user-form>
          <v-btn
            color="orange"
            flat
            large
          >Register</v-btn>
        </user-form>

        <v-btn
          type="submit"
          color="primary"
          flat
          large
        >Log In</v-btn>
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
