<template lang="pug">
  dialog-form(
    v-model="dialog"
    :title="title"
    :submit="submit"
    :color="color"
  )
    template(#activator="{ on }")
      slot(:on="on")
    template(#form)
      dynamic-fields(:object="player" :fields="fields")
        template(#field.nationality)
          nationality-field(v-model="player.nationality")
        template(#field.youth)
          v-checkbox(
            v-model="player.youth"
            label="Youth Player"
            :disabled="record !== null"
            hide-details
          )
</template>

<script>
  import { mapActions } from 'vuex'
  import pick from 'lodash.pick'
  import { DialogFormable, TeamAccessible } from '@/mixins'
  import { positions } from '@/models/Player'

  export default {
    name: 'PlayerForm',
    mixins: [
      DialogFormable,
      TeamAccessible
    ],
    props: {
      record: {
        type: Object,
        default: null
      }
    },
    data: () => ({
      valid: false,
      player: {
        name: '',
        pos: '',
        nationality: null,
        sec_pos: [],
        ovr: 60,
        value: '',
        kit_no: null,
        age: null,
        youth: false
      }
    }),
    computed: {
      fields () {
        return [
          {
            type: 'string',
            attribute: 'name',
            label: 'Name',
            prependIcon: 'mdi-account',
            required: true,
            spellcheck: 'false',
            autocapitalize: 'words',
            autocomplete: 'off',
            autocorrect: 'off'
          },
          { slot: 'nationality' },
          {
            type: 'select',
            attribute: 'pos',
            label: 'Position',
            prependIcon: 'mdi-run',
            items: positions,
            required: true
          },
          {
            type: 'select',
            attribute: 'sec_pos',
            label: 'Secondary Position(s)',
            prependIcon: 'mdi-walk',
            items: positions,
            multiple: true
          },
          {
            type: 'string',
            attribute: 'age',
            label: 'Age',
            prependIcon: 'mdi-calendar',
            required: true,
            inputmode: 'numeric'
          },
          {
            type: 'string',
            attribute: 'ovr',
            label: 'OVR',
            prependIcon: 'mdi-trending-up',
            required: true,
            inputmode: 'numeric',
            range: { min: 40, max: 100 }
          },
          {
            type: 'money',
            attribute: 'value',
            label: 'Value',
            prefix: this.team.currency,
            required: true
          },
          {
            type: 'string',
            attribute: 'kit_no',
            label: 'Kit Number',
            prependIcon: 'mdi-tshirt-crew',
            inputmode: 'numeric',
            range: { min: 1, max: 99 }
          },
          { slot: 'youth' }
        ]
      },
      title () {
        return this.record ? `Edit ${this.player.name}` : 'New Player'
      }
    },
    watch: {
      dialog (val) {
        if (val && this.record) {
          this.player = pick(this.record, [
            'id',
            'name',
            'pos',
            'age',
            'nationality',
            'ovr',
            'value',
            'kit_no',
            'youth'
          ])
          this.player.sec_pos = [...this.record.sec_pos]
        }
      }
    },
    methods: {
      ...mapActions('players', {
        createPlayer: 'CREATE',
        updatePlayer: 'UPDATE'
      }),
      async submit () {
        if (this.record) {
          await this.updatePlayer(this.player)
        } else {
          const { data } = await this.createPlayer({
            teamId: this.team.id,
            player: this.player
          })
          this.$router.push({
            name: 'teams-teamId-players-playerId',
            params: {
              teamId: this.team.id,
              playerId: data.id
            }
          })
        }
      }
    }
  }
</script>
