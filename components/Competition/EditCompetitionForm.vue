<template>
  <dialog-form
    v-model="dialog"
    title="Edit Competition"
    :submit="submit"
    :color="color"
  >
    <slot slot="activator" />

    <v-container slot="form">
      <v-layout wrap>
        <v-flex xs12>
          <v-text-field
            :value="seasonLabel(competitionData.season)"
            label="Season"
            prepend-icon="mdi-calendar-text"
            disabled
          />
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
          />
        </v-flex>
        <v-flex xs12>
          <v-select
            v-model="competition.champion"
            :items="teams"
            label="Champion"
            prepend-icon="mdi-crown"
            clearable
          />
        </v-flex>
      </v-layout>
    </v-container>
  </dialog-form>
</template>

<script>
  import Competition, { teamOptions } from '@/models/Competition'
  import {
    TeamAccessible,
    DialogFormable
  } from '@/mixins'

  export default {
    mixins: [
      DialogFormable,
      TeamAccessible
    ],
    props: {
      competitionData: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        valid: true,
        competition: {
          name: '',
          champion: ''
        }
      }
    },
    computed: {
      teams () {
        return teamOptions(this.competitionData)
      },
      competitions () {
        return [
          ...new Set(
            Competition
              .query()
              .where('teamId', this.team.id)
              .get()
              .map(c => c.name)
          )
        ]
      }
    },
    watch: {
      competitionData: {
        immediate: true,
        handler (val) {
          if (val) {
            this.competition = this.$_pick(this.competitionData, [
              'id', 'name', 'champion'
            ])
          }
        }
      }
    },
    methods: {
      async submit () {
        await this.$store.dispatch(
          'competitions/UPDATE',
          this.competition
        )
      }
    }
  }
</script>
