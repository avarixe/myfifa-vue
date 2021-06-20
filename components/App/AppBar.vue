<template>
  <v-app-bar app>
    <v-app-bar-title>
      <v-icon class="mr-2">mdi-soccer</v-icon>
      <span class="text-h5 font-weight-light">
        MyFIFA Manager
      </span>
    </v-app-bar-title>
    <v-spacer />
    <v-btn
      v-if="$route.name !== 'teams'"
      icon
      @click="$router.push({ name: 'teams' })"
    >
      <v-icon>mdi-shield-search</v-icon>
    </v-btn>
    <user-form class="d-block">
      <template #default="{ on }">
        <v-btn
          icon
          v-on="on"
        >
          <v-icon>mdi-account</v-icon>
        </v-btn>
      </template>
    </user-form>
    <v-btn
      icon
      :loading="togglingMode"
      @click="toggleMode"
    >
      <v-icon>{{ modeIcon }}</v-icon>
    </v-btn>
    <v-btn
      icon
      @click="logout"
    >
      <v-icon>mdi-exit-to-app</v-icon>
    </v-btn>

    <template #extension>
      <team-bar-extension
        v-if="team"
        :team="team"
      />
      <v-toolbar-title
        v-else
        class="text-h6 font-weight-thin"
        v-text="headline"
      />
    </template>
  </v-app-bar>
</template>

<script>
  import { mapState, mapGetters, mapActions } from 'vuex'

  export default {
    name: 'AppBar',
    data: () => ({
      togglingMode: false
    }),
    computed: {
      ...mapState('app', [
        'headline'
      ]),
      ...mapGetters([
        'currentUser'
      ]),
      teamId () {
        return this.$route.params.teamId
      },
      team () {
        return this.$store.$db().model('Team').find(this.teamId)
      },
      darkModeOn () {
        return this.currentUser.dark_mode
      },
      modeIcon () {
        return `mdi-weather-${this.darkModeOn ? 'night' : 'sunny'}`
      }
    },
    methods: {
      ...mapActions({
        logout: 'logout',
        setDarkMode: 'user/setDarkMode'
      }),
      async toggleMode () {
        try {
          this.togglingMode = true
          await this.setDarkMode(!this.darkModeOn)
        } catch (e) {
          console.error(e)
        } finally {
          this.togglingMode = false
        }
      }
    }
  }
</script>
