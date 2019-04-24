<template>
  <v-toolbar
    flat
    prominent
    style="background: #eee;"
  >
    <v-toolbar-side-icon
      v-show="responsive"
      @click.stop="toggleDrawer"
    />

    <v-toolbar-title class="tertiary--text font-weight-light">{{ $store.state.app.title }}</v-toolbar-title>

    <v-spacer />

    <v-toolbar-items v-if="authenticated">
      <v-flex
        align-center
        layout
        py-2
      >
        <nuxt-link
          v-ripple
          to="/"
          class="toolbar-items"
        >
          <v-icon color="tertiary">mdi-home</v-icon>
        </nuxt-link>

        <user-form>
          <a
            v-ripple
            class="toolbar-items"
          >
            <v-icon color="tertiary">mdi-account</v-icon>
          </a>
        </user-form>

        <a
          v-ripple
          class="toolbar-items"
          @click="logout"
        >
          <v-icon color="tertiary">mdi-exit-to-app</v-icon>
        </a>
      </v-flex>
    </v-toolbar-items>

  </v-toolbar>
</template>

<script>
  import UserForm from './UserForm'
  import {
    mapGetters,
    mapMutations
  } from 'vuex'
  import Cookie from 'js-cookie'

  export default {
    components: {
      UserForm
    },
    data: () => ({
      menu: false,
      responsive: false
    }),
    computed: mapGetters([
      'authenticated'
    ]),
    watch: {
      authenticated (val) {
        !val && this.$router.push({ name: 'index' })
      }
    },
    mounted () {
      this.updateResponsiveState()
      window.addEventListener('resize', this.updateResponsiveState)
    },
    beforeDestroy () {
      window.removeEventListener('resize', this.updateResponsiveState)
    },
    methods: {
      ...mapMutations('app', {
        toggleDrawer: 'TOGGLE_DRAWER'
      }),
      async logout () {
        await this.$store.dispatch('logout')
        Cookie.remove('token')
      },
      updateResponsiveState () {
        this.responsive = window.innerWidth < 991
      }
    }
  }
</script>
