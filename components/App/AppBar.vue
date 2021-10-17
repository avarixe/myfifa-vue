<script>
  import { ref, computed, useRouter, useStore } from '@nuxtjs/composition-api'
  import { useTeam } from '@/composables'

  export default {
    name: 'AppBar',
    setup () {
      const store = useStore()

      const infoDialog = ref(false)
      const togglingMode = ref(false)

      const headline = computed(() => store.getters['app/headline'])
      const currentUser = computed(() => store.getters.currentUser)

      const { team } = useTeam()

      const router = useRouter()
      return {
        headline,
        infoDialog,
        togglingMode,
        team,
        actions: computed(() => [
          {
            icon: 'mdi-home',
            text: 'Home',
            click: () => router.push({ name: 'index' })
          },
          {
            icon: 'mdi-account',
            text: 'Account',
            click: () => router.push({ name: 'account' })
          },
          {
            icon: `mdi-weather-${currentUser.value.darkMode ? 'night' : 'sunny'}`,
            text: `${currentUser.value.darkMode ? 'Dark' : 'Light'} Mode`,
            click: async () => {
              try {
                togglingMode.value = true
                await store.dispatch('user/setDarkMode', !currentUser.value.darkMode)
              } catch (e) {
                console.error(e)
              } finally {
                togglingMode.value = false
              }
            },
            loading: togglingMode.value
          },
          {
            icon: 'mdi-information-outline',
            text: 'About',
            click: () => { infoDialog.value = true }
          },
          {
            icon: 'mdi-exit-to-app',
            text: 'Log Out',
            click: () => store.dispatch('auth/revokeToken')
          }
        ])
      }
    }
  }
</script>

<template>
  <v-app-bar
    app
    dark
    src="/app-bar-background.jpg"
  >
    <template #img="{ props }">
      <v-img
        v-bind="props"
        gradient="to top right, rgba(19,84,122,.5), rgba(128,208,199,.8)"
      />
    </template>

    <v-img
      src="/logo.png"
      contain
      max-height="48"
      max-width="48"
    />

    <span class="text-h5 font-weight-light">
      MyFIFA Manager
    </span>

    <v-spacer />

    <v-btn
      v-for="(action, i) in actions"
      :key="i"
      icon
      class="hidden-xs-only"
      @click="action.click"
    >
      <v-icon>{{ action.icon }}</v-icon>
    </v-btn>

    <v-menu>
      <template #activator="{ on }">
        <v-btn
          icon
          class="hidden-sm-and-up"
          v-on="on"
        >
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item
          v-for="(action, i) in actions"
          :key="i"
          @click="action.click"
        >
          <v-list-item-icon>
            <v-icon>{{ action.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ action.text }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>

    <app-info v-model="infoDialog" />

    <template #extension>
      <team-bar-extension
        v-if="team"
        :team="team"
      />
      <v-toolbar-title
        v-else
        class="text-h6 font-weight-thin"
      >
        {{ headline }}
      </v-toolbar-title>
    </template>
  </v-app-bar>
</template>
