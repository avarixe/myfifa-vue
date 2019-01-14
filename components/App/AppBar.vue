<template>
  <v-toolbar
    fixed
    dense
    app
    flat
    prominent
    style="background: #eee;">
    <v-toolbar-title
      class="tertiary--text font-weight-light"
    >MyFIFA Manager</v-toolbar-title>

    <v-spacer></v-spacer>

    <v-toolbar-items v-if="authenticated">
      <v-flex
        align-center
        layout
        py-2>
        <nuxt-link
          v-ripple
          to="/"
          class="toolbar-items">
          <v-icon color="tertiary">mdi-home</v-icon>
        </nuxt-link>

        <user-form>
          <a
            v-ripple
            class="toolbar-items">
            <v-icon color="tertiary">mdi-account</v-icon>
          </a>
        </user-form>

        <a
          v-ripple
          @click="logout"
          class="toolbar-items">
          <v-icon color="tertiary">mdi-exit-to-app</v-icon>
        </a>
      </v-flex>
    </v-toolbar-items>

  </v-toolbar>
</template>

<script>
  import UserForm from './UserForm'
  import { mapGetters } from 'vuex'
  import Cookie from 'js-cookie'

  export default {
    components: {
      UserForm
    },
    data: () => ({
      menu: false
    }),
    computed: mapGetters([
      'authenticated'
    ]),
    watch: {
      authenticated (val) {
        !val && this.$router.push({ name: 'index' })
      }
    },
    methods: {
      async logout () {
        await this.$store.dispatch('logout')
        Cookie.remove('token')
      }
    }
  }
</script>
