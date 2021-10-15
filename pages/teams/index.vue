<script>
  import { useContext, useFetch, useStore } from '@nuxtjs/composition-api'
  import { gql } from 'nuxt-graphql-request'
  import { teamFragment } from '@/fragments'

  export default {
    name: 'TeamsPage',
    setup () {
      const { $graphql } = useContext()
      const store = useStore()

      useFetch(async () => {
        store.commit('app/setPage', {
          headline: 'Teams'
        })

        const query = gql`
          query fetchTeams {
            teams { ...TeamData }
          }
          ${teamFragment}
        `

        const { teams } = await $graphql.default.request(query)
        await store.$db().model('Team').insert({ data: teams })
      })
    }
  }
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <team-form>
          <template #activator="{ on }">
            <v-btn v-on="on">
              <v-icon left>mdi-plus</v-icon>
              Team
            </v-btn>
          </template>
        </team-form>
      </v-col>
      <v-col cols="12">
        <team-grid />
      </v-col>
    </v-row>
  </v-container>
</template>
