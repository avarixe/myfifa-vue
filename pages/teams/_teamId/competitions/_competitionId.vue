<script>
  import {
    ref,
    computed,
    watchEffect,
    useContext,
    useFetch,
    useRoute,
    useRouter,
    useStore
  } from '@nuxtjs/composition-api'
  import { gql } from 'nuxt-graphql-request'
  import { useTeam } from '@/composables'
  import { competitionFragment, stageFragment } from '@/fragments'

  export default {
    name: 'CompetitionPage',
    setup () {
      const store = useStore()
      const { teamId, seasonLabel } = useTeam()

      const route = useRoute()
      const competitionId = computed(() => route.value.params.competitionId)
      const competition = computed(() => {
        return store.$db().model('Competition')
          .query()
          .with('stages.tableRows')
          .with('stages.fixtures.legs')
          .find(competitionId.value)
      })

      const router = useRouter()
      watchEffect(() => {
        if (!competition.value) {
          router.push({
            name: 'teams-teamId',
            params: {
              teamId: teamId.value
            }
          })
        }
      })

      const { $graphql } = useContext()
      const readonly = ref(0)
      const competitionSeason = ref('')
      useFetch(async () => {
        const query = gql`
          query fetchCompetition($id: ID!) {
            competition(id: $id) {
              ...CompetitionData
              stages { ...StageData }
            }
          }
          ${competitionFragment}
          ${stageFragment}
        `

        const { competition: competitionData } =
          await $graphql.default.request(query, { id: competitionId.value })
        await store.$db().model('Competition').insert({ data: competitionData })

        readonly.value = competitionData.champion && competitionData.champion.length > 0
        competitionSeason.value = seasonLabel(competitionData.season)

        const title = `${competitionData.name} (${competitionSeason.value})`
        store.commit('app/setPage', {
          title,
          headline: title
        })
      })

      const stages = computed(() => competition.value?.stages || [])
      return {
        competition,
        competitionSeason,
        tables: computed(() => stages.value.filter(stage => stage.table)),
        rounds: computed(() => stages.value.filter(stage => !stage.table)),
        tableKey: ref(0),
        readonly
      }
    }
  }
</script>

<template>
  <v-container>
    <v-row v-if="competition">
      <v-col cols="12">
        <v-btn
          :to="competition.linkToSeason"
          nuxt
          class="mb-1"
        >
          <v-icon left>mdi-calendar</v-icon>
          View Season
        </v-btn>
        <v-btn
          class="mb-1"
          @click="readonly = !readonly"
        >
          <v-icon left>
            mdi-{{ readonly ? 'pencil-off' : 'circle-edit-outline' }}
          </v-icon>
          {{ readonly ? 'Readonly' : 'Edit' }} Mode
        </v-btn>
      </v-col>
      <v-col
        class="text-center"
        cols="12"
      >
        <div class="subheading">{{ competitionSeason }}</div>
        <div class="text-h4">{{ competition.name }}</div>
        <div
          v-if="competition.champion"
          class="title"
        >
          <v-icon
            color="yellow darken-2"
            left
          >
            mdi-crown
          </v-icon>
          {{ competition.champion }}
          <v-icon
            color="yellow darken-2"
            right
          >
            mdi-crown
          </v-icon>
        </div>
      </v-col>
      <v-col
        v-if="!readonly"
        class="text-center"
        cols="12"
      >
        <competition-form
          :record="competition"
          color="orange"
        >
          <template #activator="{ on }">
            <v-btn
              class="my-1"
              dark
              color="orange"
              v-on="on"
            >
              Edit
            </v-btn>
          </template>
        </competition-form>
        <competition-form
          :record="competition"
          color="red"
          close
        >
          <template #activator="{ on }">
            <v-btn
              class="my-1"
              dark
              color="red"
              v-on="on"
            >
              Close
            </v-btn>
          </template>
        </competition-form>
        <stage-form :competition="competition" />
        <record-remove
          :record="competition"
          store="competitions"
          :label="`${competitionSeason} ${competition.name}`"
        >
          <template #activator="{ on }">
            <v-btn
              class="my-1"
              dark
              v-on="on"
            >
              Remove
            </v-btn>
          </template>
        </record-remove>
      </v-col>

      <!-- Table Stages -->
      <v-col
        v-if="tables.length > 0"
        cols="12"
      >
        <v-card outlined>
          <v-card-text>
            <v-tabs
              v-model="tableKey"
              centered
              center-active
            >
              <v-tab
                v-for="table in tables"
                :key="table.id"
              >
                {{ table.name }}
              </v-tab>
            </v-tabs>
            <v-tabs-items
              v-model="tableKey"
              touchless
            >
              <v-tab-item
                v-for="table in tables"
                :key="table.id"
              >
                <table-stage
                  :table="table"
                  :readonly="readonly"
                />
              </v-tab-item>
            </v-tabs-items>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Elimination Round Stages -->
      <v-col
        v-if="rounds.length > 0"
        cols="12"
      >
        <v-card outlined>
          <v-card-text>
            <v-tabs
              centered
              center-active
            >
              <v-tab
                v-for="round in rounds"
                :key="round.id"
              >
                {{ round.name }}
              </v-tab>
              <v-tab-item
                v-for="round in rounds"
                :key="round.id"
              >
                <round-stage
                  :round="round"
                  :readonly="readonly"
                />
              </v-tab-item>
            </v-tabs>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
  .v-card + .v-card {
    margin-top: 1rem;
  }
</style>
