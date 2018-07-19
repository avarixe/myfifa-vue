<template>
  <v-form v-model="valid" @submit.prevent="authenticate">
    <v-card>
      <v-card-title primary-title>
        <div class="headline">Log In</div>
      </v-card-title>
      <v-card-text>
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
              :append-icon="visible ? 'visibility_off' : 'visibility'"
              @click:append="visible = !visible"
            ></v-text-field>
          </v-flex>
        </v-layout>
      </v-card-text>
      <v-alert
        type="error"
        v-model="formError"
        dismissible>
        {{ errorMessage }}
      </v-alert>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn type="submit" :disabled="!valid" flat large>Log In</v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>


<script>
  import Cookie from 'js-cookie'
  import FormMixin from '@/mixins/Form'

  export default {
    mixins: [ FormMixin ],
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
        try {
          const { data } = await this.$store.dispatch('login', this.credentials)
          Cookie.set('token', data.access_token, data.expires_in / 86400)
        } catch (e) {
          this.errorMessage = e.message
        }
      }
    }
  }
</script>
