<script>
  import { ref, toRef, computed, useContext, useStore } from '@nuxtjs/composition-api'
  import { gql } from 'nuxt-graphql-request'
  import { isRequired } from '@/functions'

  export default {
    name: 'TeamBadgeUploader',
    props: {
      team: { type: Object, required: true }
    },
    setup (props) {
      const key = ref(0)
      const loading = ref(false)
      const badge = ref(null)

      const { $config } = useContext()
      const team = toRef(props, 'team')
      const badgeUrl = computed(() => {
        return team.value.badgePath
          ? `${$config.baseURL.replace(/\/api/, '')}${team.value.badgePath}`
          : null
      })

      const store = useStore()
      const submit = async () => {
        const query = gql`
          mutation uploadBadge($teamId: ID!, $badge: Upload!) {
            uploadBadge(teamId: $teamId, badge: $badge) {
              team { badgePath }
              errors { fullMessages }
            }
          }
        `

        const { uploadBadge: { team: teamData, errors } } =
          await this.$graphql.default.request(query, {
            teamId: team.value.id,
            badge: badge.value
          })

        if (teamData) {
          store.$db().model('Team').update({
            id: team.value.id,
            badgePath: teamData.badgePath
          })
        } else {
          throw new Error(errors.fullMessages[0])
        }
      }

      return {
        key,
        loading,
        badge,
        badgeUrl,
        submit,
        rulesForBadge: [isRequired('Badge')]
      }
    }
  }
</script>

<template>
  <dialog-form
    :key="key"
    :title="`${team.badgePath ? 'Change' : 'Upload'} Badge`"
    :submit="submit"
  >
    <template #activator="{ on }">
      <slot
        name="activator"
        :on="on"
      />
    </template>
    <template #form>
      <v-col
        v-if="team.badgePath"
        cols="12"
      >
        <v-subheader>Current Badge</v-subheader>
        <v-img
          :src="badgeUrl"
          height="100px"
          contain
          class="text-center"
        />
      </v-col>
      <v-col cols="12">
        <v-file-input
          v-model="badge"
          label="Badge"
          :rules="rulesForBadge"
          prepend-icon="mdi-shield-plus"
          accept="image/*"
        />
      </v-col>
    </template>
  </dialog-form>
</template>
