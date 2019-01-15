<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <login-form></login-form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import { mapGetters } from 'vuex'
  import LoginForm from '@/components/App/LoginForm'

  export default {
    layout: 'default',
    middleware: 'home',
    components: {
      LoginForm
    },
    data: () => ({
      mode: 'login'
    }),
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
