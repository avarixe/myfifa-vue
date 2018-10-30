<template>
  <dialog-form
    v-model="dialog"
    title="New Stage"
    :submit="submit"
    :color="color">
    <slot slot="activator"></slot>
    <v-container slot="form">
      <v-layout wrap>
        <v-flex xs12>
          <v-text-field
            v-model="stage.name"
            :rules="$_validate('Name', ['required'])"
            label="Name"
            prepend-icon="mdi-table"
            spellcheck="false"
            autocapitalize="words"
            autocomplete="off"
            autocorrect="off"
          ></v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-text-field
            v-model="stage.num_teams"
            :rules="$_validate('Number of Teams', ['required'])"
            label="Number of Teams"
            prepend-icon="mdi-account-group"
            type="number"
          ></v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-text-field
            v-model="stage.num_fixtures"
            :rules="$_validate('Number of Fixtures', ['required'])"
            label="Number of Fixtures"
            prepend-icon="mdi-sword-cross"
            type="number"
          ></v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-radio-group v-model="stage.table" hide-details row>
            <v-radio label="Table" :value="true"></v-radio>
            <v-radio label="Elimination Round" :value="false"></v-radio>
          </v-radio-group>
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

  export default {
    mixins: [
      DialogFormable,
      TeamAccessible
    ],
    props: {
      competition: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        valid: false,
        stage: {
          name: '',
          num_teams: null,
          num_fixtures: null,
          table: false
        }
      }
    },
    computed: {
    },
    methods: {
      async submit () {
        await this.$store.dispatch('stage/create', {
          competitionId: this.competition.id,
          stage: this.stage
        })
      }
    }
  }
</script>
