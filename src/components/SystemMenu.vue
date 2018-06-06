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
    <v-tooltip left>
      <v-btn
        slot="activator"
        dark
        color="red"
        fab
        @click.native="logOut"
      >
        <v-icon>exit_to_app</v-icon>
      </v-btn>
      <span>Log Out</span>
    </v-tooltip>
    <v-tooltip left>
      <v-btn
        slot="activator"
        dark
        color="indigo"
        fab
        to="/teams"
      >
        <v-icon>swap_horiz</v-icon>
      </v-btn>
      <span>Change Team</span>
    </v-tooltip>
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