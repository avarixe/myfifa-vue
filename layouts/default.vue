<template>
  <v-app dark>
    <client-only v-if="authenticated">
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
        'title',
        'mode'
      ]),
      ...mapGetters([
        'authenticated'
      ]),
      teamPage () {
        return 'teamId' in this.$route.params
      },
      team () {
        return this.$store.$db().model('Team').find(this.$route.params.teamId)
      }
    },
    watch: {
      mode: {
        immediate: true,
        handler (val) {
          this.$vuetify.theme.dark = val === 'dark'
        }
      }
    }
  }
</script>
