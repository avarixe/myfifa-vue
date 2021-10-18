<script>
  import { toRef, computed, useContext, useStore } from '@nuxtjs/composition-api'

  export default {
    name: 'TeamBarExtension',
    props: {
      team: { type: Object, required: true }
    },
    setup (props) {
      const store = useStore()
      const headline = computed(() => store.state.app.headline)
      const caption = computed(() => store.state.app.caption)

      const team = toRef(props, 'team')
      const { $config } = useContext()
      const badgeUrl = computed(() => {
        return team.value.badgePath &&
          `${$config.baseURL.replace(/\/api/, '')}${team.value.badgePath}`
      })

      return {
        headline,
        caption,
        badgeUrl
      }
    }
  }
</script>

<template>
  <v-sheet
    color="transparent"
    width="100%"
    class="d-flex align-center"
  >
    <span class="mr-2">
      <v-img
        v-if="team.badgePath"
        :src="badgeUrl"
        height="32px"
        width="32px"
        contain
      />
      <v-tooltip
        v-else
        bottom
      >
        <template #activator="{ on }">
          <v-icon
            large
            v-on="on"
          >
            mdi-shield-off-outline
          </v-icon>
        </template>
        <span>Edit Team to upload Badge</span>
      </v-tooltip>
    </span>
    <v-toolbar-title>
      <div
        class="text-overline"
        :style="{ lineHeight: '1rem' }"
      >
        {{ team.name }}
      </div>
      <div class="text-h6 font-weight-thin">
        {{ headline }}
        <small v-show="caption">{{ caption }}</small>
      </div>
    </v-toolbar-title>
    <v-spacer />
    <team-date-picker />
  </v-sheet>
</template>
