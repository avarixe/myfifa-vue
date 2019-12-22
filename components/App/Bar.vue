<template lang="pug">
  v-app-bar(app clipped-left)
    v-app-bar-nav-icon(v-show="responsive" @click.stop="toggleDrawer")
    span.mr-2(v-if="team && team.badge_path")
      v-img(
        :src="badgeUrl"
        height="32px"
        width="32px"
        contain
      )
    v-toolbar-title
      .overline {{ overline }}
      .headline.font-weight-thin
        | {{ headline }}
        |&nbsp;
        small(v-if="caption") {{ caption }}
    v-spacer
    app-forms-menu
</template>

<script>
  import { Vue, Component, Action, namespace } from 'nuxt-property-decorator'
  import { Team } from '@/models'
  import { baseURL } from '@/api'
  import AppFormsMenu from './FormsMenu'

  const app = namespace('app')

  @Component({
    components: {
      AppFormsMenu
    }
  })
  export default class AppBar extends Vue {
    @Action('entities/deleteAll') clearStore
    @app.State overline
    @app.State headline
    @app.State caption
    @app.Mutation('TOGGLE_DRAWER') toggleDrawer
    responsive = false

    get team () {
      return this.$route.params.teamId
        ? Team.find(this.$route.params.teamId)
        : null
    }

    get badgeUrl () {
      return this.team && this.team.badge_path
        ? `${baseURL}${this.team.badge_path}`
        : null
    }

    mounted () {
      this.updateResponsiveState()
      window.addEventListener('resize', this.updateResponsiveState)
    }

    beforeDestroy () {
      window.removeEventListener('resize', this.updateResponsiveState)
      this.clearStore()
      this.$router.push({ name: 'index' })
    }

    updateResponsiveState () {
      this.responsive = window.innerWidth < 991
    }
  }
</script>
