<template lang="pug">
  v-app(dark)
    client-only(v-if="authenticated")
      app-bar
      app-drawer
    app-broadcaster
    v-content
      team-channel(v-if="teamPage")
      nuxt
</template>

<script>
  import { mapState, mapGetters } from 'vuex'
  import { Team } from '@/models'
  import AppBar from '@/components/App/Bar'
  import AppBroadcaster from '@/components/App/Broadcaster'
  import TeamChannel from '@/components/Team/Channel'
  import AppDrawer from '@/components/App/Drawer'

  export default {
    name: 'Layout',
    components: {
      AppBar,
      AppBroadcaster,
      TeamChannel,
      AppDrawer
    },
    head () {
      return {
        title: this.title
      }
    },
    computed: {
      ...mapState('app', [
        'title',
        'mode'
      ]),
      ...mapGetters([
        'authenticated'
      ]),
      teamPage () {
        return 'teamId' in this.$route.params
      },
      team () {
        return Team.find(this.$route.params.teamId)
      }
    },
    watch: {
      mode: {
        immediate: true,
        handler (val) {
          this.$vuetify.theme.dark = val === 'dark'
        }
      }
    }
  }
</script>
