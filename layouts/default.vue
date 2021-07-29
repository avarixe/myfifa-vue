<template>
  <v-app>
    <template v-if="currentUser">
      <app-bar />
      <template v-if="team">
        <team-navigator />
        <client-only>
          <team-channel />
        </client-only>
      </template>
    </template>
    <app-broadcaster />
    <v-main>
      <nuxt />
    </v-main>
  </v-app>
</template>

<script>
  import { mapState, mapGetters } from 'vuex'

  export default {
    name: 'Layout',
    middleware: [
      'authenticated'
    ],
    transition: 'fade-transition',
    head () {
      return {
        title: this.title
      }
    },
    computed: {
      ...mapState('auth', [
        'token'
      ]),
      ...mapState('app', [
        'title'
      ]),
      ...mapGetters([
        'currentUser'
      ]),
      team () {
        return this.$store.$db().model('Team').find(this.$route.params.teamId)
      }
    },
    watch: {
      'currentUser.darkMode': {
        immediate: true,
        handler (darkModeOn) {
          this.$vuetify.theme.dark = darkModeOn
        }
      },
      token: {
        immediate: true,
        handler (token) {
          if (token) {
            this.$graphql.default.setHeader('Authorization', `Bearer ${token}`)
          } else {
            this.$graphql.default.setHeaders({})
            this.$vuetify.theme.dark = true
          }
        }
      }
    }
  }
</script>
