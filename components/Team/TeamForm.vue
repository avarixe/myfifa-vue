<template>
  <dialog-form
    v-model="dialog"
    :title="title"
    :submit="submit"
    :color="color"
  >
    <slot slot="activator" />

    <v-container slot="form">
      <v-layout wrap>
        <v-flex xs12>
          <v-text-field
            v-model="team.title"
            :rules="$_validate('Team', ['required'])"
            label="Team"
            prepend-icon="mdi-account-multiple"
            spellcheck="false"
            autocapitalize="words"
            autocomplete="off"
            autocorrect="off"
          />
        </v-flex>
        <v-flex xs12>
          <v-menu
            v-model="menu"
            ref="menu"
            :close-on-content-click="false"
            :return-value.sync="team.start_date"
            lazy
            transition="scale-transition"
            full-width
          >
            <v-text-field
              v-model="team.start_date"
              slot="activator"
              label="Start Date"
              prepend-icon="mdi-calendar-today"
              :rules="$_validate('Start Date', ['required', 'date'])"
              readonly
            />
            <v-date-picker
              v-model="team.start_date"
              landscape
              :color="color"
              @input="$refs.menu.save(team.start_date)"
            />
          </v-menu>
        </v-flex>
        <v-flex xs12>
          <v-text-field
            v-model="team.currency"
            :rules="$_validate('Currency', ['required'])"
            label="Currency"
          />
        </v-flex>
      </v-layout>
    </v-container>
  </dialog-form>
</template>

<script>
  import { mapActions } from 'vuex'
  import { Team } from '@/models'
  import { DialogFormable } from '@/mixins'

  export default {
    mixins: [
      DialogFormable
    ],
    props: {
      teamId: [String, Number]
    },
    data () {
      return {
        menu: false,
        team: {
          title: '',
          start_date: this.$_format(new Date()),
          currency: '$'
        }
      }
    },
    computed: {
      title () {
        return this.teamData ? 'Edit ' + this.team.title : 'New Team'
      }
    },
    watch: {
      dialog: {
        immediate: true,
        handler (val) {
          if (val && this.teamId) {
            Object.assign(
              this.team,
              this.$_pick(Team.find(this.teamId), [
                'id', 'title', 'start_date', 'currency'
              ])
            )
          }
        }
      }
    },
    methods: {
      ...mapActions('teams', {
        create: 'CREATE',
        update: 'UPDATE'
      }),
      async submit () {
        const save = 'id' in this.team ? this.update : this.create
        await save(this.team)
      }
    }
  }
</script>
