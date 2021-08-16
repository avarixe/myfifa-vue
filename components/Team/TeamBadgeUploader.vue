<template>
  <dialog-form
    :key="key"
    v-model="dialog"
    :title="`${team.badgePath ? 'Change' : 'Upload'} Badge`"
    :submit="submit"
    :color="color"
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

<script>
  import { gql } from 'nuxt-graphql-request'
  import { DialogFormable } from '@/mixins'
  import { isRequired } from '@/functions'

  export default {
    name: 'TeamBadgeUploader',
    mixins: [
      DialogFormable
    ],
    props: {
      team: { type: Object, required: true }
    },
    data: () => ({
      key: 0,
      loading: false,
      badge: null,
      rulesForBadge: [isRequired('Badge')]
    }),
    computed: {
      badgeUrl () {
        return this.team.badgePath
          ? `${this.$config.baseURL.replace(/\/api/, '')}${this.team.badgePath}`
          : null
      }
    },
    methods: {
      async submit () {
        const query = gql`
          mutation uploadBadge($teamId: ID!, $badge: Upload!) {
            uploadBadge(teamId: $teamId, badge: $badge) {
              team { badgePath }
              errors { fullMessages }
            }
          }
        `

        const { uploadBadge: { team, errors } } =
          await this.$graphql.default.request(query, {
            teamId: this.team.id,
            badge: this.badge
          })

        if (team) {
          this.$store.$db().model('Team').update({
            id: this.team.id,
            badgePath: team.badgePath
          })
        } else {
          throw new Error(errors.fullMessages[0])
        }
      }
    }
  }
</script>
