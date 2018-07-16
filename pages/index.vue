<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
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
    computed: mapGetters('user', [ 'authenticated' ]),
    components: {
      'login-form': LoginForm
    },
    mounted () {
      if (this.authenticated) {
        this.$router.push('/teams')
      }
    }
  }
</script>