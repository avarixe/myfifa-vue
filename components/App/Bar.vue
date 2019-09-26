<template>
  <v-app-bar
    app
    clipped-left
  >
    <v-app-bar-nav-icon
      v-show="responsive"
      @click.stop="toggleDrawer"
    />

    <span
      v-if="team"
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
      <div class="overline">{{ overline }}</div>
      <div class="headline font-weight-thin">
        {{ headline }}
        <small v-if="caption">
          {{ caption }}
        </small>
      </div>
    </v-toolbar-title>
  </v-app-bar>
</template>

<script>
  import { Vue, Component } from 'nuxt-property-decorator'
  import { mapState, mapMutations } from 'vuex'
  import { Team } from '@/models'
  import { baseURL } from '@/api'

  @Component({
    computed: mapState('app', [
      'overline',
      'headline',
      'caption'
    ]),
    methods: mapMutations('app', {
      toggleDrawer: 'TOGGLE_DRAWER'
    })
  })
  export default class AppBar extends Vue {
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
      this.$store.dispatch('entities/deleteAll')
      this.$router.push({ name: 'index' })
    }

    updateResponsiveState () {
      this.responsive = window.innerWidth < 991
    }
  }
</script>
