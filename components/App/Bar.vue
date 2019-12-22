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
  import { mapState, mapMutations, mapActions } from 'vuex'
  import { Team } from '@/models'
  import { baseURL } from '@/api'
  import AppFormsMenu from './FormsMenu'

  export default {
    name: 'AppBar',
    components: {
      AppFormsMenu
    },
    data: () => ({
      responsive: false
    }),
    computed: {
      ...mapState('app', [
        'overline',
        'headline',
        'caption'
      ]),
      team () {
        return this.$route.params.teamId
          ? Team.find(this.$route.params.teamId)
          : null
      },
      badgeUrl () {
        return this.team && this.team.badge_path
          ? `${baseURL}${this.team.badge_path}`
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
      ...mapMutations('app', {
        toggleDrawer: 'TOGGLE_DRAWER'
      }),
      ...mapActions({
        clearStore: 'entities/deleteAll'
      }),
      updateResponsiveState () {
        this.responsive = window.innerWidth < 991
      }
    }
  }
</script>
