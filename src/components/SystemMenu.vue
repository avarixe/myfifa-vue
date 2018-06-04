<template>
  <v-speed-dial
    v-model="fab"
    v-if="loggedIn"
    fixed
    bottom
    right
  >
    <v-btn
      slot="activator"
      v-model="fab"
      color="blue darken-2"
      dark
      fab
    >
      <v-icon>menu</v-icon>
      <v-icon>close</v-icon>
    </v-btn>
    <v-btn
      dark
      color="red"
      fab
      @click.native="logOut"
    >
      <v-icon>exit_to_app</v-icon>
    </v-btn>
  </v-speed-dial>
</template>

<script>
  export default {
    data: () => ({
      fab: false
    }),
    computed: {
      loggedIn () {
        return !!this.$store.state.user.token
      }
    },
    methods: {
      logOut () {
        this.$store.dispatch('user/logUserOut')
          .then(() => {
            this.$router.push({ path: '/' })
          })
      }
    }
  }
</script>