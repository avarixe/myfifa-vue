<template>
  <dialog-form
    v-model="dialog"
    title="Close Competition"
    :submit="submit"
    :color="color"
  >
    <template #activator="{ on }">
      <slot :on="on" />
    </template>

    <template #form>
      <v-container>
        <v-layout wrap>
          <v-flex xs12>
            <v-select
              v-model="competition.champion"
              :items="teams"
              label="Champion"
              prepend-icon="mdi-crown"
              :rules="$_validate('Champion', ['required'])"
            />
          </v-flex>
        </v-layout>
      </v-container>
    </template>
  </dialog-form>
</template>

<script>
  import { teamOptions } from '@/models/Competition'
  import { TeamAccessible, DialogFormable } from '@/mixins'

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
