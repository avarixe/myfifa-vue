<template>
  <v-speed-dial
    v-model="fab"
    fixed
    bottom
    right>
    <v-btn
      slot="activator"
      v-model="fab"
      color="blue darken-2"
      dark
      fab>
      <v-icon>menu</v-icon>
      <v-icon>close</v-icon>
    </v-btn>
    <v-tooltip left color="red darken-2">
      <v-btn
        slot="activator"
        dark
        color="red darken-2"
        fab
        @click.native="logout">
        <v-icon>exit_to_app</v-icon>
      </v-btn>
      <span>Log Out</span>
    </v-tooltip>
    <v-tooltip left color="indigo">
      <v-btn
        slot="activator"
        dark
        color="indigo"
        fab
        to="/">
        <v-icon>home</v-icon>
      </v-btn>
      <span>Home Page</span>
    </v-tooltip>
  </v-speed-dial>
</template>

<script>
  import Cookie from 'js-cookie'

  export default {
    data: () => ({
      fab: false
    }),
    methods: {
      async logout () {
        await this.$store.dispatch('logout')
        Cookie.remove('token')
      }
    }
  }
</script>
