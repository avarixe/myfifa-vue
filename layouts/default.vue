<template>
  <v-app dark>
    <template v-if="currentUser">
      <app-bar />
      <template v-if="teamPage">
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
    head () {
      return {
        title: this.title
      }
    },
    computed: {
      ...mapState(['token']),
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
      },
      token: {
        immediate: true,
        handler (token) {
          if (token) {
            this.$graphql.default.setHeader('authorization', `Bearer ${token}`)
          } else {
            this.$graphql.default.setHeaders({})
          }
        }
      }
    }
  }
</script>
