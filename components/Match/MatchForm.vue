<script>
  import {
    ref,
    reactive,
    toRef,
    computed,
    watchEffect,
    useContext,
    useRouter,
    useStore
  } from '@nuxtjs/composition-api'
  import { gql } from 'nuxt-graphql-request'
  import { parseISO } from 'date-fns'
  import { useTeam } from '@/composables'
  import { competitionFragment, baseStageFragment } from '@/fragments'
  import { isRequired } from '@/functions'

  export default {
    name: 'MatchForm',
    props: {
      record: { type: Object, default: null }
    },
    setup (props) {
      const loading = ref(false)
      const competitionsLoaded = ref(false)
      const attributes = reactive({
        playedOn: null,
        competition: '',
        stage: null,
        home: '',
        away: '',
        extraTime: false
      })

      const { team } = useTeam()
      const isHome = computed(() => attributes.home == team.value.name)
      const isAway = computed(() => attributes.away == team.value.name)

      const season = computed(() => {
        const startDate = parseISO(team.value.startedOn)
        const datePlayed = parseISO(attributes.playedOn)
        return parseInt((datePlayed - startDate) / (525600 * 60 * 1000))
      })

      const store = useStore()
      const competitions = computed(() => {
        return store.$db().model('Competition')
          .query()
          .where('teamId', team.value.id)
          .where('season', season.value)
          .where(comp => attributes.competition === comp.name || !comp.champion)
          .get()
          .map(competition => competition.name)
      })

      const competitionId = computed(() => {
        if (attributes.competition) {
          const competition = store.$db().model('Competition')
            .query()
            .where('teamId', team.value.id)
            .where('season', season.value)
            .where('name', attributes.competition)
            .first()
          return competition ? competition.id : null
        }
        return null
      })

      const stages = computed(() => {
        const competition = store.$db().model('Competition')
          .query()
          .with('stages')
          .where('teamId', team.value.id)
          .where('season', season.value)
          .where('name', attributes.competition)
          .first()

        if (competition) {
          return competition.stages
            .filter(stage => !stage.table)
            .map(stage => stage.name)
        } else {
          return []
        }
      })

      const { $graphql } = useContext()
      const loadCompetitions = async () => {
        try {
          const query = gql`
            query fetchCompetitions($teamId: ID!) {
              team(id: $teamId) {
                competitions {
                  ...CompetitionData
                  stages { ...BaseStageData }
                }
              }
            }
            ${competitionFragment}
            ${baseStageFragment}
          `

          loading.value = true

          const { team: { competitions } } =
            await $graphql.default.request(query, { teamId: team.value.id })

          await store.$db().model('Competition').insertOrUpdate({ data: competitions })
        } catch (e) {
          alert(e.message)
        } finally {
          loading.value = false
        }
      }

      const dialog = ref(false)
      const title = ref('New Match')
      const record = toRef(props, 'record')
      watchEffect(() => {
        if (dialog.value) {
          if (record.value) {
            attributes.playedOn = record.value.playedOn
            attributes.competition = record.value.competition
            attributes.stage = record.value.stage
            attributes.home = record.value.home
            attributes.away = record.value.away
            attributes.extraTime = record.value.extraTime
            title.value = 'Edit Match'
          } else {
            attributes.playedOn = team.value.currentlyOn
            attributes.extraTime = false
          }

          !competitionsLoaded.value && loadCompetitions()
        }
      })

      const setHome = () => {
        attributes.home = team.value.name
        if (attributes.away === team.value.name) {
          attributes.away = ''
        }
      }

      const setAway = () => {
        attributes.away = team.value.name
        if (attributes.home === team.value.name) {
          attributes.home = ''
        }
      }

      const router = useRouter()
      const submit = async () => {
        if (record.value) {
          await store.dispatch('matches/update', {
            id: record.value.id,
            attributes
          })
        } else {
          const { id: matchId } = await store.dispatch('matches/create', {
            teamId: team.value.id,
            attributes
          })
          router.push({
            name: 'teams-teamId-matches-matchId',
            params: {
              teamId: team.value.id,
              matchId
            }
          })
        }
      }

      return {
        attributes,
        dialog,
        title,
        submit,
        setHome,
        setAway,
        isHome,
        isAway,
        competitions,
        stages,
        loading,
        rulesFor: {
          competition: [isRequired('Competition')],
          home: [isRequired('Home Team')],
          away: [isRequired('Away Team')]
        }
      }
    }
  }
</script>

<template>
  <dialog-form
    v-model="dialog"
    :title="title"
    :submit="submit"
  >
    <template #activator="{ on }">
      <slot
        name="activator"
        :on="on"
      />
    </template>
    <template #form>
      <v-col cols="12">
        <v-date-field
          v-model="attributes.playedOn"
          label="Date Played"
          prepend-icon="mdi-calendar-today"
          required
        />
      </v-col>
      <v-col cols="12">
        <v-select
          v-model="attributes.competition"
          label="Competition"
          prepend-icon="mdi-trophy"
          :items="competitions"
          :rules="rulesFor.competition"
          :loading="loading"
        />
      </v-col>
      <v-scroll-y-transition mode="out-in">
        <v-col
          v-if="attributes.competition"
          cols="12"
        >
          <v-combobox
            v-model="attributes.stage"
            label="Stage"
            prepend-icon="mdi-tournament"
            :items="stages"
            spellcheck="false"
            autocapitalize="words"
            autocomplete="off"
            autocorrect="off"
          />
        </v-col>
      </v-scroll-y-transition>
      <v-col cols="12">
        <team-combobox
          v-model="attributes.home"
          label="Home Team"
          prepend-icon="mdi-home"
          :rules="rulesFor.home"
          :append-outer-icon="`mdi-shield-${isHome ? 'star' : 'outline'}`"
          @click:append-outer="setHome"
        />
      </v-col>
      <v-col cols="12">
        <team-combobox
          v-model="attributes.away"
          label="Away Team"
          prepend-icon="mdi-bus"
          :rules="rulesFor.away"
          :append-outer-icon="`mdi-shield-${isAway ? 'star' : 'outline'}`"
          @click:append-outer="setAway"
        />
      </v-col>
      <v-col cols="12">
        <v-checkbox
          v-model="attributes.extraTime"
          label="Extra Time Required"
          hide-details
        />
      </v-col>
    </template>
  </dialog-form>
</template>
