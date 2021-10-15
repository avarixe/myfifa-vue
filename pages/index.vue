<script>
  import { ref, reactive, computed, useFetch, useContext, useStore } from '@nuxtjs/composition-api'
  import { gql } from 'nuxt-graphql-request'
  import { parseISO, differenceInYears } from 'date-fns'
  import { teamFragment } from '@/fragments'

  export default {
    name: 'HomePage',
    setup () {
      const teamIndex = ref(0)
      const latestTeams = reactive({ value: [] })
      const currentTeam = computed(() => latestTeams.value[teamIndex.value])

      const { $graphql, $config } = useContext()
      const store = useStore()
      useFetch(async () => {
        store.commit('app/setPage', { headline: 'Home' })

        const query = gql`
          query fetchTeams {
            teams {
              ...TeamData
              lastMatch {
                id
                home
                away
                competition
                playedOn
              }
            }
          }
          ${teamFragment}
        `

        const { teams } = await $graphql.default.request(query)

        latestTeams.value = teams.slice(0, 5)
      })

      return {
        latestTeams,
        teamIndex,
        currentTeam,
        lastMatch: computed(() => currentTeam.value && currentTeam.value.lastMatch),
        badgeUrl: team => {
          return team.badgePath
            ? `${$config.baseURL.replace(/\/api/, '')}${team.badgePath}`
            : null
        },
        teamLinks: team => {
          const date = parseISO(team.startedOn)
          const currentDate = parseISO(team.currentlyOn)
          const season = differenceInYears(currentDate, date)
          return [
            {
              to: `/teams/${team.id}/seasons/${season}`,
              icon: 'mdi-calendar',
              text: 'Current Season'
            },
            {
              to: `/teams/${team.id}/players`,
              icon: 'mdi-run',
              text: 'Players'
            },
            {
              to: `/teams/${team.id}/matches`,
              icon: 'mdi-soccer-field',
              text: 'Matches'
            },
            {
              to: `/teams/${team.id}/squads`,
              icon: 'mdi-clipboard-text',
              text: 'Squads'
            }
          ]
        }
      }
    }
  }
</script>

<template>
  <v-container class="fill-height">
    <v-row
      align="center"
      justify="center"
    >
      <v-col cols="12">
        <v-card v-if="currentTeam">
          <div class="d-sm-flex flex-no-wrap text-center">
            <v-avatar
              class="ma-3"
              size="250"
              tile
            >
              <v-img
                v-if="currentTeam.badgePath"
                :src="badgeUrl(currentTeam)"
                contain
              />
              <v-tooltip
                v-else
                bottom
              >
                <template #activator="{ on }">
                  <v-icon
                    size="100"
                    v-on="on"
                  >
                    mdi-shield-off-outline
                  </v-icon>
                </template>
                <span>Edit Team to upload Badge</span>
              </v-tooltip>
            </v-avatar>
            <div :style="{ width: '100%' }">
              <v-card-title>
                <div class="text-h5">{{ currentTeam.name }}</div>
                <v-spacer />
                <v-hover #default="{ hover }">
                  <v-btn
                    :to="`/teams/${currentTeam.id}`"
                    nuxt
                    text
                    class="my-2"
                  >
                    <v-icon :left="hover">mdi-arrow-right</v-icon>
                    <span v-show="hover">Go To Team</span>
                  </v-btn>
                </v-hover>
              </v-card-title>
              <v-divider class="mx-4" />
              <v-card-text>
                <v-row dense>
                  <v-col
                    cols="12"
                    lg="6"
                    class="text-left"
                  >
                    <div>
                      <span class="grey--text">Started Date:</span>
                      <b>{{ currentTeam.startedOn | formatDate }}</b>
                    </div>
                    <div>
                      <span class="grey--text">Current Date:</span>
                      <b>{{ currentTeam.currentlyOn | formatDate }}</b>
                    </div>
                    <div>
                      <span class="grey--text">Currency:</span>
                      <b>{{ currentTeam.currency }}</b>
                    </div>
                  </v-col>
                  <v-col
                    v-if="lastMatch"
                    cols="12"
                    lg="6"
                    class="d-flex align-top"
                  >
                    <div
                      class="grey--text"
                      :style="{ minWidth: '75px' }"
                    >
                      Last Match:
                    </div>
                    <div
                      class="d-inline-block text-center px-4"
                      :style="{ width: '100%' }"
                    >
                      <b>{{ lastMatch.home }} v {{ lastMatch.away }}</b>
                      <div>{{ lastMatch.competition }}</div>
                      <div><i>{{ lastMatch.playedOn | formatDate }}</i></div>
                      <v-hover #default="{ hover }">
                        <v-btn
                          :to="`/teams/${currentTeam.id}/matches/${lastMatch.id}`"
                          nuxt
                          outlined
                          color="info"
                          class="my-2"
                        >
                          <v-icon :left="hover">mdi-play</v-icon>
                          <span v-show="hover">Go To Match</span>
                        </v-btn>
                      </v-hover>
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-actions class="justify-space-around">
                <v-hover
                  v-for="(link, i) in teamLinks(currentTeam)"
                  :key="i"
                  #default="{ hover }"
                >
                  <v-btn
                    :to="link.to"
                    nuxt
                    text
                  >
                    <v-icon :left="hover">{{ link.icon }}</v-icon>
                    <span v-show="hover">{{ link.text }}</span>
                  </v-btn>
                </v-hover>
              </v-card-actions>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col
        v-for="(team, i) in latestTeams.value"
        v-show="i !== teamIndex"
        :key="i"
        cols="3"
        sm="3"
      >
        <v-card
          class="text-center"
          @click="teamIndex = i"
        >
          <v-avatar
            class="ma-3"
            tile
          >
            <v-img
              v-if="team.badgePath"
              :src="badgeUrl(team)"
              contain
            />
            <div v-else>{{ team.name }}</div>
          </v-avatar>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-btn
          :to="{ name: 'teams' }"
          nuxt
        >
          <v-icon left>mdi-shield-search</v-icon>
          View All Teams
        </v-btn>
        <team-form>
          <template #activator="{ on }">
            <v-btn v-on="on">
              <v-icon left>mdi-plus</v-icon>
              Create New Team
            </v-btn>
          </template>
        </team-form>
      </v-col>
    </v-row>
  </v-container>
</template>
