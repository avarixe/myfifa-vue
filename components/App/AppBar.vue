<template>
  <v-app-bar
    app
  >
    <v-app-bar-nav-icon
      v-show="responsive"
      @click.stop="toggleDrawer"
    />
    <span
      v-if="team && team.badge_path"
      class="mr-2"
    >
      <v-img
        :src="badgeUrl"
        height="32px"
        width="32px"
        contain
      />
    </span>
    <v-toolbar-title>
      <div class="text-overline">{{ overline }}</div>
      <div class="text-h5 font-weight-thin">
        {{ headline }}
        <small v-if="caption">{{ caption }}</small>
      </div>
    </v-toolbar-title>
    <v-spacer />
    <app-forms-menu />
  </v-app-bar>
</template>

<script>
  import { mapState, mapMutations, mapActions } from 'vuex'

  export default {
    name: 'AppBar',
    data: () => ({
      responsive: false
    }),
    computed: {
      ...mapState('app', [
        'overline',
        'headline',
        'caption'
      ]),
      teamId () {
        return this.$route.params.teamId
      },
      team () {
        return this.teamId && this.$store.$db().model('Team').find(this.teamId)
      },
      badgeUrl () {
        const { browserBaseURL } = this.$config.axios
        return this.team && this.team.badge_path
          ? `${browserBaseURL.replace(/\/api/, '')}${this.team.badge_path}`
          : null
      }
    },
    mounted () {
      this.updateResponsiveState()
      window.addEventListener('resize', this.updateResponsiveState)
    },
    beforeDestroy () {
      window.removeEventListener('resize', this.updateResponsiveState)
      this.clearStore()
      this.$router.push({ name: 'index' })
    },
    methods: {
      ...mapMutations('app', [
        'toggleDrawer'
      ]),
      ...mapActions({
        clearStore: 'orm/deleteAll'
      }),
      updateResponsiveState () {
        this.responsive = window.innerWidth < 991
      }
    }
  }
</script>
