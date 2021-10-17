<script>
  import {
    computed,
    watchEffect,
    useContext,
    useMeta,
    useStore
  } from '@nuxtjs/composition-api'
  import { useTeam } from '@/composables'

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
          $vuetify.theme.dark = currentUser.value
            ? currentUser.value.darkMode
            : true
        } else {
          $graphql.default.setHeaders({})
          $vuetify.theme.dark = true
        }
      })

      const { team } = useTeam()
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
