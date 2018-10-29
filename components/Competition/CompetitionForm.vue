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
          <v-combobox
            v-model="match.competition"
            :items="competitions"
            :rules="$_validate('Competition', ['required'])"
            label="Name"
            prepend-icon="whatshot"
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
        match: Object.assign({
          name: '',
          season: 0
        }, this.initialCompetition)
      }
    },
    computed: {
      ...mapGetters('match', [
        'competitions',
        'teams'
      ]),
      title () {
        return this.match.id ? 'Edit Match' : 'New Match'
      },
      isTeamGame () {
        return this.match.home === this.team.title ||
               this.match.away === this.team.title
      }
    },
    methods: {
      ...mapActions('match', [
        'create',
        'update'
      ]),
      setHome () {
        this.match.home = this.team.title
        if (this.match.away === this.team.title) {
          this.match.away = ''
        }
      },
      setAway () {
        this.match.away = this.team.title
        if (this.match.home === this.team.title) {
          this.match.home = ''
        }
      },
      async submit () {
        if (this.initialCompetition) {
          await this.update(this.match)
        } else {
          const { data } = await this.create({
            teamId: this.team.id,
            match: this.match
          })
          this.$router.push({
            name: 'matches-id',
            params: { id: data.id }
          })
        }
      }
    }
  }
</script>
