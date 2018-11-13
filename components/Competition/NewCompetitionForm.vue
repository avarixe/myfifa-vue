<template>
  <dialog-form
    v-model="dialog"
    title="New Competition"
    :submit="submit"
    :color="color">
    <slot slot="activator"></slot>
    <v-container slot="form">
      <v-layout wrap>
        <v-flex xs12>
          <v-text-field
            :value="seasonLabel(season)"
            label="Season"
            prepend-icon="mdi-calendar-text"
            disabled
          ></v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-combobox
            v-model="competition.name"
            :items="competitions"
            :rules="$_validate('Name', ['required'])"
            label="Name"
            prepend-icon="mdi-trophy"
            spellcheck="false"
            autocapitalize="words"
            autocomplete="off"
            autocorrect="off"
          ></v-combobox>
        </v-flex>
        <v-flex xs12>
          <v-select
            v-model="competition.preset_format"
            :items="presetFormats"
            label="Preset Format"
            prepend-icon="mdi-cogs"
            clearable
          ></v-select>
        </v-flex>
        <v-scroll-y-transition mode="out-in">
          <v-flex v-if="competition.preset_format" xs12>
            <v-text-field
              v-model="competition.num_teams"
              :rules="$_validate('Number of Teams', ['required'])"
              label="Number of Teams"
              prepend-icon="mdi-account-multiple"
              type="number"
            ></v-text-field>
          </v-flex>
        </v-scroll-y-transition>
        <v-scroll-y-transition mode="out-in">
          <v-flex v-if="competition.preset_format === 'Group + Knockout'" xs12>
            <v-text-field
              v-model="competition.num_teams_per_group"
              :rules="$_validate('Teams per Group', ['required'])"
              label="Teams per Group"
              prepend-icon="mdi-account-group"
              type="number"
            ></v-text-field>
          </v-flex>
        </v-scroll-y-transition>
        <v-scroll-y-transition mode="out-in">
          <v-flex v-if="competition.preset_format === 'Group + Knockout'" xs12>
            <v-text-field
              v-model="competition.num_advances_from_group"
              :rules="$_validate('Teams Advancing per Group', ['required'])"
              label="Teams Advance per Group"
              prepend-icon="mdi-forward"
              type="number"
            ></v-text-field>
          </v-flex>
        </v-scroll-y-transition>
        <v-scroll-y-transition mode="out-in">
          <v-text-field
            v-if="competition.preset_format && competition.preset_format !== 'League'"
            v-model="competition.num_matches_per_fixture"
            :rules="$_validate('Matches per Fixture', ['required'])"
            label="Matches per Fixture"
            prepend-icon="mdi-sword-cross"
            type="number"
          ></v-text-field>
        </v-scroll-y-transition>
      </v-layout>
    </v-container>
  </dialog-form>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import TeamAccessible from '@/mixins/TeamAccessible'
  import DialogFormable from '@/mixins/DialogFormable'

  export default {
    mixins: [
      DialogFormable,
      TeamAccessible
    ],
    data () {
      return {
        valid: false,
        presetFormats: [
          'League',
          'Knockout',
          'Group + Knockout'
        ],
        competition: {
          name: '',
          season: 0,
          preset_format: null,
          num_teams: null,
          num_teams_per_group: null,
          num_advances_from_group: null,
          num_matches_per_fixture: null
        }
      }
    },
    computed: {
      ...mapGetters({
        season: 'team/season',
        competitions: 'competition/names'
      })
    },
    mounted () {
      this.competition.season = this.season
    },
    methods: {
      ...mapActions('competition', [ 'create' ]),
      async submit () {
        const { data } = await this.create({
          teamId: this.team.id,
          competition: this.competition
        })
        this.$router.push({
          name: 'competitions-id',
          params: { id: data.id }
        })
      }
    }
  }
</script>
