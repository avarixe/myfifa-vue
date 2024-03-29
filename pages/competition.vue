<template>
  <v-container>
    <v-row>
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
              v-model="tableTab"
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
              v-model="tableTab"
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

<script>
  import { mapMutations } from 'vuex'
  import { gql } from 'nuxt-graphql-request'
  import { TeamAccessible } from '@/mixins'
  import { competitionFragment, stageFragment } from '@/fragments'

  export default {
    name: 'CompetitionPage',
    mixins: [
      TeamAccessible
    ],
    transition: 'fade-transition',
    data: () => ({
      tableTab: 0,
      readonly: true
    }),
    async fetch () {
      const { teamId, competitionId } = this.$route.query

      if (teamId && competitionId) {
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

        const { competition } = await this.$graphql.default.request(query, {
          id: this.competitionId
        })
        await this.$store.$db().model('Competition').insert({ data: competition })

        this.readonly = competition.champion && competition.champion.length > 0

        this.setPage({
          title: this.title,
          headline: this.title
        })
      } else if (teamId) {
        this.$router.push({ name: 'team', query: { teamId } })
      } else {
        this.$router.push('/')
      }
    },
    computed: {
      competitionId () {
        return parseInt(this.$route.query.competitionId)
      },
      competition () {
        return this.$store.$db().model('Competition')
          .query()
          .with('stages.tableRows')
          .with('stages.fixtures.legs')
          .find(this.competitionId)
      },
      title () {
        return this.competition
          ? `${this.competition.name} (${this.competitionSeason})`
          : 'Competition'
      },
      stages () {
        return this.competition.stages
      },
      tables () {
        return this.stages.filter(stage => stage.table)
      },
      rounds () {
        return this.stages.filter(stage => !stage.table)
      },
      competitionSeason () {
        return this.seasonLabel(this.competition.season)
      }
    },
    watch: {
      competition () {
        if (!this.competition) {
          this.$router.push({
            name: 'season',
            query: {
              teamId: this.team.id,
              season: this.season
            }
          })
        }
      },
      '$route.query': '$fetch'
    },
    methods: mapMutations('app', {
      setPage: 'setPage'
    })
  }
</script>

<style scoped>
  .v-card + .v-card {
    margin-top: 1rem;
  }
</style>
