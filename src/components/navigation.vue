<template>
  <v-speed-dial
    v-model="fab"
    v-if="authenticated"
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
        v-show="this.$route.path !== '/teams'"
        dark
        color="indigo"
        fab
        to="/teams">
        <v-icon>swap_horiz</v-icon>
      </v-btn>
      <span>Change Team</span>
    </v-tooltip>
  </v-speed-dial>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'

  export default {
    data: () => ({ fab: false }),
    computed: mapGetters('user', [ 'authenticated' ]),
    methods: mapActions('user', [ 'logout' ])
  }
</script>