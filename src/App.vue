<template>
  <v-app>
    <v-toolbar color="primary" dark fixed app>
      <v-toolbar-title>
        <router-link to="/" tag="span">
          <v-icon>fa-futbol</v-icon>
          MyFIFA Manager
        </router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-content>
      <myfifa-login-drawer></myfifa-login-drawer>
      <myfifa-fab></myfifa-fab>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
  import LoginDrawer from '@/components/LoginDrawer'
  import SystemMenu from '@/components/SystemMenu'

  export default {
    data: () => ({
    }),
    components: {
      'myfifa-login-drawer': LoginDrawer,
      'myfifa-fab': SystemMenu
    },
    name: 'App'
  }
</script>

<style scoped>
  .toolbar__title > span {
    cursor: pointer;
  }
</style>