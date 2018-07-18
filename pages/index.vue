<template>
  <v-container fluid fill-height>
    <v-layout
      v-if="authenticated"
      justify-center>
      <v-flex xs12>
        <v-jumbotron>
          <h3 class="display-3">Welcome to MyFIFA Manager</h3>
          <v-divider class="my-3"></v-divider>
          <v-btn
            class="mx-0"
            color="primary"
            large
            to="/teams">
            Teams
          </v-btn>
        </v-jumbotron>
      </v-flex>
    </v-layout>
    <v-layout
      v-else
      align-center
      justify-center>
      <v-flex xs12 sm8 md6>
        <login-form></login-form>
        <!-- <registration-page></registration-page> -->
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import { mapGetters } from 'vuex'
  import LoginForm from '@/components/LoginForm'

  export default {
    data () {
      return {
      }
    },
    computed: mapGetters([ 'authenticated' ]),
    components: {
      'login-form': LoginForm
    }
  }
</script>
