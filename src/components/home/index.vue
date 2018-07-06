<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md6>
        <login-page></login-page>
        <!-- <registration-page></registration-page> -->
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import { mapGetters } from 'vuex'
  import LoginPage from '@/components/home/login'

  export default {
    data () {
      return {
      }
    },
    computed: mapGetters('user', [ 'authenticated' ]),
    components: {
      'login-page': LoginPage
    },
    mounted () {
      if (this.authenticated) {
        this.$router.push('/teams')
      }
    }
  }
</script>