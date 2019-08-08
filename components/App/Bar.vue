<template>
  <v-app-bar
    app
    clipped-left
  >
    <v-app-bar-nav-icon
      v-show="responsive"
      @click.stop="toggleDrawer"
    />

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
