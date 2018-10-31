<template>
  <dialog-form
    v-model="dialog"
    :title="title"
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
      initialCompetition: Object
    },
    data () {
      return {
        valid: !!this.initialCompetition,
        competition: Object.assign({
          name: '',
          season: 0
        }, this.initialCompetition)
      }
    },
    computed: {
      ...mapGetters({
        season: 'team/season',
        competitions: 'competition/names'
      }),
      title () {
        return this.competition.id
          ? 'Edit Competition'
          : 'New Competition'
      }
    },
    mounted () {
      this.competition.season = this.season
    },
    methods: {
      ...mapActions('competition', [
        'create',
        'update'
      ]),
      async submit () {
        if (this.initialCompetition) {
          await this.update(this.competition)
        } else {
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
  }
</script>
