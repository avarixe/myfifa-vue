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
            v-model="team.title"
            :rules="$_validate('Team', ['required'])"
            label="Team"
            prepend-icon="people"
            autofocus
          ></v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-menu
            ref="menu"
            :close-on-content-click="false"
            v-model="menu"
            :return-value.sync="team.start_date"
            lazy
            transition="scale-transition"
            full-width>
            <v-text-field
              slot="activator"
              label="Start Date"
              prepend-icon="calendar_today"
              v-model="team.start_date"
              :rules="$_validate('Start Date', ['required', 'date'])"
              readonly
            ></v-text-field>
            <v-date-picker
              v-model="team.start_date"
              landscape
              @input="$refs.menu.save(team.start_date)"
            ></v-date-picker>
          </v-menu>
        </v-flex>
        <v-flex xs12>
          <v-text-field
            v-model="team.currency"
            :rules="$_validate('Currency', ['required'])"
            label="Currency"
          ></v-text-field>
        </v-flex>
      </v-layout>
    </v-container>
  </dialog-form>
</template>

<script>
  import { mapActions } from 'vuex'
  import FormBase from '@/mixins/FormBase'

  export default {
    mixins: [
      FormBase
    ],
    props: {
      initialTeam: {
        type: Object
      }
    },
    data () {
      return {
        team: Object.assign({
          id: '',
          title: '',
          start_date: this.$_format(new Date()),
          currency: '$'
        }, this.initialTeam),
        menu: false
      }
    },
    computed: {
      title () {
        return this.initialTeam ? 'Edit ' + this.team.title : 'New Team'
      }
    },
    methods: {
      ...mapActions('team', [
        'create',
        'update'
      ]),
      async submit () {
        const save = this.team.id ? this.update : this.create
        await save(this.team)
      }
    }
  }
</script>
