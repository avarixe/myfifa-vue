<template>
  <dialog-form
    v-model="dialog"
    title="Log In"
    :submit="authenticate">
    <v-btn
      slot="activator"
      color="primary"
      large
    >Log In</v-btn>
    <v-container slot="form">
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
            :append-icon="`mdi-eye${visible ? '-off' : ''}`"
            @click:append="visible = !visible"
          ></v-text-field>
        </v-flex>
      </v-layout>
    </v-container>
  </dialog-form>
</template>


<script>
  import Cookie from 'js-cookie'
  import DialogFormable from '@/mixins/DialogFormable'

  export default {
    mixins: [ DialogFormable ],
    data: () => ({
      visible: false,
      credentials: {
        email: '',
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
