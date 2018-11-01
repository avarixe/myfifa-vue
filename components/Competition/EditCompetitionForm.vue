<template>
  <dialog-form
    v-model="dialog"
    title="Edit Competition"
    :submit="submit"
    :color="color">
    <slot slot="activator"></slot>
    <v-container slot="form">
      <v-layout wrap>
        <v-flex xs12>
          <v-text-field
            :value="seasonLabel(competitionData.season)"
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
            v-model="competition.champion"
            :items="teams"
            label="Champion"
            prepend-icon="mdi-crown"
            clearable
          ></v-select>
        </v-flex>
      </v-layout>
    </v-container>
  </dialog-form>
</template>

<script>
  import { addYears } from 'date-fns'
  import { mapGetters, mapActions } from 'vuex'
  import TeamAccessible from '@/mixins/TeamAccessible'
  import DialogFormable from '@/mixins/DialogFormable'
  import { teamOptions } from '@/api/modules/competition'

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
      const { id, name, champion } = this.competitionData
      return {
        valid: true,
        competition: { id, name, champion }
      }
    },
    computed: {
      ...mapGetters({
        competitions: 'competition/names'
      }),
      teams () {
        return teamOptions(this.competitionData)
      }
    },
    methods: {
      ...mapActions('competition', [ 'update' ]),
      async submit () {
        await this.update(competition)
      }
    }
  }
</script>
