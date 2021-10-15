<script>
  import { computed, watchEffect, useContext, useMeta, useRoute, useStore } from '@nuxtjs/composition-api'

  export default {
    name: 'Layout',
    middleware: [
      'authenticated'
    ],
    transition: 'fade-transition',
    head: {},
    setup () {
      const store = useStore()
      useMeta({
        title: store.state.app.title
      })

      const { $graphql, $vuetify } = useContext()
      const token = computed(() => store.state.auth.token)
      const currentUser = computed(() => store.getters.currentUser)
      watchEffect(() => {
        if (token.value) {
          $graphql.default.setHeader('Authorization', `Bearer ${token.value}`)
          $vuetify.theme.dark = currentUser.value.darkMode
        } else {
          $graphql.default.setHeaders({})
          $vuetify.theme.dark = true
        }
      }, { immediate: true })

      const route = useRoute()
      const team = computed(() => store.$db().model('Team').find(route.value.params.teamID))

      return {
        currentUser,
        team
      }
    }
  }
</script>

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
