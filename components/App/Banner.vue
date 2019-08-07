<template>
  <v-banner
    v-if="headline"
    sticky
    single-line
    width="100%"
  >
    <div class="overline">{{ overline }}</div>
    <div class="headline font-weight-thin">
      {{ headline }}
      <small v-if="caption">
        {{ caption }}
      </small>
    </div>
  </v-banner>
</template>

<script>
  import { Vue, Component } from 'nuxt-property-decorator'
  import { mapState } from 'vuex'

  @Component({
    computed: mapState('app', [
      'overline',
      'headline',
      'caption'
    ])
  })
  export default class AppBanner extends Vue {
  }
</script>
