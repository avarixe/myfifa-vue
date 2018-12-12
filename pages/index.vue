<template>
  <v-container grid-list-lg>
    <v-layout row wrap>
      <v-flex xs12>
        <login-form color="blue"></login-form>
      </v-flex>
      <v-flex xs12>
        <user-form>
          <v-btn color="orange" dark large>Register</v-btn>
        </user-form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import { mapGetters } from 'vuex'
  import LoginForm from '@/components/App/LoginForm'
  import UserForm from '@/components/App/UserForm'

  export default {
    layout: 'default',
    middleware: 'home',
    components: {
      LoginForm,
      UserForm
    },
    computed: mapGetters(['authenticated']),
    watch: {
      authenticated: {
        immediate: true,
        handler (val) {
          val && this.$router.push({ name: 'teams' })
        }
      }
    }
  }
</script>
