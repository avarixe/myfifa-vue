<template>
  <v-card>
    <v-card-title>
      <div class="title">
        <template v-if="edit">
          <v-text-field
            v-model="stage.name"
            :rules="$_validate('Stage Name', ['required'])"
            class="d-inline-block"
            @click.stop
          />
        </template>
        <span v-else>{{ round.name }}</span>
      </div>

      <template v-if="!readonly">
        <edit-mode-button
          :mode="edit"
          :changed="stageChanged"
          @toggle-mode="edit = !edit"
        />

        <v-tooltip bottom>
          <template #activator="{ on }">
            <v-btn
              v-on="on"
              icon
              @click="addFixture"
            >
              <v-icon>mdi-plus-circle</v-icon>
            </v-btn>
          </template>
          Add Fixture
        </v-tooltip>

        <stage-remove :stage="round" />
      </template>
    </v-card-title>

    <v-simple-table>
      <thead>
        <th
          v-if="!readonly"
          style="width:40px"
        >
          <v-tooltip right>
            <template #activator="{ on }">
              <v-btn
                v-on="on"
                icon
                @click="override = !override"
              >
                <v-icon>mdi-playlist-edit</v-icon>
              </v-btn>
            </template>
            Edit All
          </v-tooltip>
        </th>
        <th class="text-xs-right">Home Team</th>
        <th
          colspan="2"
          class="text-xs-center"
        >Score</th>
        <th class="text-xs-left">Away Team</th>
      </thead>
      <tbody>
        <fixture-view
          v-for="(item, i) in items"
          :key="i"
          :headers="headers"
          :fixture-data="item"
          :override="override"
        />
      </tbody>
    </v-simple-table>

  </v-card>
</template>

<script>
  import { EditModeButton } from '@/helpers'
  import StageRemove from './StageRemove'
  import FixtureView from './FixtureView'

  export default {
    components: {
      EditModeButton,
      StageRemove,
      FixtureView
    },
    props: {
      round: {
        type: Object,
        required: true
      },
      readonly: Boolean
    },
    data: () => ({
      stage: {},
      edit: false,
      override: false
    }),
    computed: {
      headers () {
        let headers = [
          {
            text: 'Home Team',
            value: 'home_team',
            sortable: false,
            align: 'right'
          },
          {
            text: 'Home Score',
            value: 'home_score',
            sortable: false,
            align: 'right'
          },
          {
            text: 'Away Score',
            value: 'away_score',
            sortable: false,
            align: 'left'
          },
          {
            text: 'Away Team',
            value: 'away_team',
            sortable: false,
            align: 'left'
          }
        ]
        !this.readonly && headers.unshift({
          text: '',
          value: null,
          sortable: false,
          width: '40px'
        })
        return headers
      },
      items () {
        return Object.values(this.round.fixtures) || []
      },
      stageChanged () {
        return this.stage.name !== this.round.name
      }
    },
    watch: {
      edit (val) {
        if (val) {
          const { id, name } = this.round
          this.stage = { id, name }
        } else if (this.stageChanged) {
          this.$store.dispatch('stages/UPDATE', this.stage)
        }
      }
    },
    methods: {
      addFixture () {
        this.$store.dispatch('fixtures/CREATE', {
          stageId: this.round.id,
          fixture: { home_team: '', away_team: '' }
        })
      }
    }
  }
</script>
