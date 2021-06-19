<template>
  <v-app dark>
    <client-only v-if="currentUser">
      <app-bar />
      <app-drawer />
    </client-only>
    <app-broadcaster />
    <v-main>
      <team-channel v-if="teamPage" />
      <nuxt />
    </v-main>
  </v-app>
</template>

<script>
  import { mapState, mapGetters } from 'vuex'

  export default {
    name: 'Layout',
    head () {
      return {
        title: this.title
      }
    },
    computed: {
      ...mapState('app', [
        'title'
      ]),
      ...mapGetters([
        'currentUser'
      ]),
      teamPage () {
        return 'teamId' in this.$route.params
      },
      team () {
        return this.$store.$db().model('Team').find(this.$route.params.teamId)
      }
    },
    watch: {
      'currentUser.dark_mode': {
        immediate: true,
        handler (darkModeOn) {
          this.$vuetify.theme.dark = darkModeOn
        }
      }
    }
  }
</script>
