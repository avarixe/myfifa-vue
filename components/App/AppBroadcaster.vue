<script>
  import { ref, computed, watchEffect, useStore } from '@nuxtjs/composition-api'

  export default {
    name: 'AppBroadcaster',
    setup () {
      const store = useStore()
      const snackbar = ref(false)
      const message = computed(() => store.state.broadcaster.message)

      watchEffect(() => {
        snackbar.value = message.value.length > 0

        if (!snackbar.value) {
          store.commit('broadcaster/clear')
        }
      })

      return {
        snackbar,
        message,
        color: computed(() => store.state.broadcaster.color)
      }
    }
  }
</script>

<template>
  <v-snackbar
    v-model="snackbar"
    :color="color"
    bottom
    app
  >
    {{ message }}
    <template #action="{ attrs }">
      <v-btn
        dark
        text
        v-bind="attrs"
        @click="snackbar = false"
      >
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>
