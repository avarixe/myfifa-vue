<template>
  <v-app-bar
    app
    clipped-left
  >
    <v-app-bar-nav-icon
      v-show="responsive && $route.params.teamId"
      @click.stop="toggleDrawer"
    />

    <v-toolbar-title class="tertiary--text font-weight-light">
      MyFIFA Manager
    </v-toolbar-title>

    <v-spacer />

    <template v-if="authenticated">
      <v-btn
        to="/"
        nuxt
        icon
      >
        <v-icon color="tertiary">mdi-home</v-icon>
      </v-btn>

      <user-form>
        <template #default="{ on }">
          <v-btn
            v-on="on"
            icon
          >
            <v-icon color="tertiary">mdi-account</v-icon>
          </v-btn>
        </template>
      </user-form>

      <v-btn
        icon
        @click="logout"
      >
        <v-icon color="tertiary">mdi-exit-to-app</v-icon>
      </v-btn>
    </template>
  </v-app-bar>
</template>

<script>
  import UserForm from './UserForm'
  import { mapGetters, mapMutations } from 'vuex'
  import Cookie from 'js-cookie'

  export default {
    components: {
      UserForm
    },
    data: () => ({
      responsive: false
    }),
    computed: mapGetters([
      'authenticated'
    ]),
    watch: {
      authenticated (val) {
        if (!val) {
          this.$store.dispatch('entities/deleteAll')
          this.$router.push({ name: 'index' })
        }
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
