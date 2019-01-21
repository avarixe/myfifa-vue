<template>
  <v-toolbar
    flat
    prominent
    style="background: #eee;"
  >
    <v-toolbar-side-icon
      v-show="!drawer"
      @click.stop="toggleDrawer"
    />

    <v-toolbar-title
      class="tertiary--text font-weight-light"
      v-text="$store.state.app.title"
    />

    <v-spacer />

    <v-toolbar-items
      v-if="authenticated"
    >
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
          <v-icon
            color="tertiary"
            v-text="'mdi-home'"
          />
        </nuxt-link>

        <user-form>
          <a
            v-ripple
            class="toolbar-items"
          >
            <v-icon
              color="tertiary"
              v-text="'mdi-account'"
            />
          </a>
        </user-form>

        <a
          v-ripple
          class="toolbar-items"
          @click="logout"
        >
          <v-icon
            color="tertiary"
            v-text="'mdi-exit-to-app'"
          />
        </a>
      </v-flex>
    </v-toolbar-items>

  </v-toolbar>
</template>

<script>
  import UserForm from './UserForm'
  import {
    mapState,
    mapGetters,
    mapMutations
  } from 'vuex'
  import Cookie from 'js-cookie'

  export default {
    components: {
      UserForm
    },
    data: () => ({
      menu: false
    }),
    computed: {
      ...mapState('app', [
        'drawer'
      ]),
      ...mapGetters([
        'authenticated'
      ])
    },
    watch: {
      authenticated (val) {
        !val && this.$router.push({ name: 'index' })
      }
    },
    methods: {
      ...mapMutations('app', {
        toggleDrawer: 'TOGGLE_DRAWER'
      }),
      async logout () {
        await this.$store.dispatch('logout')
        Cookie.remove('token')
      }
    }
  }
</script>
