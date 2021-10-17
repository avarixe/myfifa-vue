<script>
  import { ref, computed, toRef, watch, onUnmounted, useStore } from '@nuxtjs/composition-api'

  export default {
    name: 'AppInfo',
    props: {
      value: { type: Boolean, required: true }
    },
    setup (props, { emit }) {
      const dialog = ref(false)
      watch(dialog, open => {
        emit('input', open)
      })

      const value = toRef(props, 'value')
      watch(value, open => {
        dialog.value = open
      })

      onUnmounted(() => {
        dialog.value = false
      })

      const store = useStore()
      const version = computed(() => store.state.version)

      return {
        dialog,
        version
      }
    }
  }
</script>

<template>
  <v-dialog
    v-model="dialog"
    width="300px"
  >
    <v-card>
      <v-toolbar dense>
        <v-toolbar-title class="font-weight-light white--text">
          <v-icon left>mdi-soccer</v-icon>
          MyFIFA Manager
        </v-toolbar-title>

        <v-spacer />

        <v-btn
          icon
          href="https://github.com/avarixe/myfifa-vue"
          target="_blank"
          rel="noopener"
        >
          <v-icon>mdi-github</v-icon>
        </v-btn>
      </v-toolbar>
      <v-simple-table>
        <tbody>
          <tr>
            <td>Version:</td>
            <td class="light-blue--text">{{ version }}</td>
          </tr>
          <tr>
            <td>Built with:</td>
            <td>
              <v-tooltip bottom>
                <template #activator="{ on }">
                  <v-icon v-on="on">mdi-nuxt</v-icon>
                </template>
                Nuxt.js
              </v-tooltip>
              <v-tooltip bottom>
                <template #activator="{ on }">
                  <v-icon v-on="on">mdi-vuejs</v-icon>
                </template>
                Vue.js
              </v-tooltip>
              <v-tooltip bottom>
                <template #activator="{ on }">
                  <v-icon v-on="on">mdi-vuetify</v-icon>
                </template>
                Vuetify
              </v-tooltip>
              <v-tooltip bottom>
                <template #activator="{ on }">
                  <v-icon v-on="on">mdi-language-ruby-on-rails</v-icon>
                </template>
                Ruby on Rails
              </v-tooltip>
            </td>
          </tr>
        </tbody>
      </v-simple-table>
    </v-card>
  </v-dialog>
</template>
