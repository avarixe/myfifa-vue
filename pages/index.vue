<template>
  <v-container fluid fill-height>
    <v-layout justify-center>
      <v-flex xs12>
        <v-jumbotron>
          <h3 class="display-3">Welcome to MyFIFA Manager</h3>
          <v-divider class="my-3"></v-divider>
          <v-btn
            v-if="authenticated"
            class="mx-0"
            color="primary"
            large
            nuxt
            to="/teams">
            Teams
          </v-btn>
          <login-form v-else></login-form>
        </v-jumbotron>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import { mapGetters } from 'vuex'
  import LoginForm from '@/components/LoginForm'

  export default {
    components: {
      'login-form': LoginForm
    },
    computed: mapGetters([ 'authenticated' ]),
    beforeMount () {
      this.$store.commit('team/clear')
    }
  }
</script>
