<template>
  <v-app-bar
    app
    clipped-left
  >
    <v-app-bar-nav-icon
      v-show="responsive && $route.params.teamId"
      @click.stop="toggleDrawer"
    />

    <v-toolbar-title class="font-weight-light">
      MyFIFA Manager
    </v-toolbar-title>

    <v-spacer />

    <template v-if="authenticated">
      <v-btn
        to="/"
        nuxt
        icon
      >
        <v-icon>mdi-home</v-icon>
      </v-btn>

      <user-form>
        <template #default="{ on }">
          <v-btn
            icon
            v-on="on"
          >
            <v-icon>mdi-account</v-icon>
          </v-btn>
        </template>
      </user-form>

      <v-btn
        icon
        @click="logout"
      >
        <v-icon>mdi-exit-to-app</v-icon>
      </v-btn>
    </template>
  </v-app-bar>
</template>

<script>
  import { Vue, Component } from 'nuxt-property-decorator'
  import UserForm from './UserForm'
  import { mapGetters, mapMutations } from 'vuex'
  import Cookie from 'js-cookie'

  @Component({
    components: {
      UserForm
    },
    computed: mapGetters([
      'authenticated'
    ]),
    methods: mapMutations('app', {
      toggleDrawer: 'TOGGLE_DRAWER'
    })
  })
  export default class AppBar extends Vue {
    responsive = false

    mounted () {
      this.updateResponsiveState()
      window.addEventListener('resize', this.updateResponsiveState)
    }

    beforeDestroy () {
      window.removeEventListener('resize', this.updateResponsiveState)
      this.$store.dispatch('entities/deleteAll')
      this.$router.push({ name: 'index' })
    }

    async logout () {
      await this.$store.dispatch('logout')
      Cookie.remove('token')
    }

    updateResponsiveState () {
      this.responsive = window.innerWidth < 991
    }
  }
</script>
