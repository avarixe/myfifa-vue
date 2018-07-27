<template>
  <dialog-form
    v-model="dialog"
    :submit="submit"
    :color="color"
    full-width>
    <v-tooltip slot="activator" top>
      <v-btn slot="activator" icon>
        <v-icon>update</v-icon>
      </v-btn>
      Mass Update
    </v-tooltip>
    <template slot="header">
      <div class="headline">Mass Update Players</div>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        label="Search"
        append-icon="search"
      ></v-text-field>
    </template>
    <template slot="form">
      <v-data-table
        v-model="selected"
        select-all
        :headers="headers"
        :items="players"
        item-key="id"
        :search="search"
        no-data-text="No Players to Update">
        <template slot="headers" slot-scope="props">
          <th>
            <v-checkbox
              :input-value="props.all"
              :indeterminate="props.indeterminate"
              primary
              hide-details
              @click.native="toggleAll"
            ></v-checkbox>
          </th>
          <th
            v-for="header in props.headers"
            :key="header.text"
            :class="'column text-xs-' + header.align"
            v-text="header.text"
          ></th>
        </template>
        <template slot="items" slot-scope="props">
          <tr :active="props.selected">
            <td>
              <v-checkbox
                v-model="props.selected"
                primary
                hide-details
              ></v-checkbox>
            </td>
            <td v-text="props.item.name"></td>
            <td class="text-xs-center" v-text="props.item.pos"></td>
            <td class="text-xs-center">
              <v-btn icon @click.native="props.item.ovr--">
                <v-icon>remove</v-icon>
              </v-btn>
              {{ props.item.ovr }}
              <v-btn icon @click.native="props.item.ovr++">
                <v-icon>add</v-icon>
              </v-btn>
            </td>
            <td>
              <v-text-field
                v-model="props.item.value"
                type="number"
                prefix="$"
                :hint="$_numberHint(props.item.value)"
                :rules="$_validate('Value', ['required'])"
                persistent-hint
              ></v-text-field>
            </td>
          </tr>
        </template>
      </v-data-table>
    </template>
  </dialog-form>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import TeamAction from '@/mixins/TeamAction'
  import FormBase from '@/mixins/FormBase'

  export default {
    mixins: [
      FormBase,
      TeamAction
    ],
    data () {
      return {
        players: [],
        selected: [],
        headers: [
          { text: 'Name',     value: 'name',  align: 'left' },
          { text: 'Position', value: 'pos',   align: 'center' },
          { text: 'OVR',      value: 'ovr',   align: 'center' },
          { text: 'Value',    value: 'value', align: 'center' }
        ],
        search: ''
      }
    },
    computed: {
      ...mapGetters('player', {
        activePlayers: 'active'
      }),
      selectedPlayers () {
        return this.players.map(player => player.selected)
      }
    },
    watch: {
      dialog (val) {
        if (val) {
          console.log(this.activePlayers)
          this.players = this.activePlayers.map(player => ({ ...player }))
          this.selected = []
        } else {
          Object.assign(this.$data, this.$options.data.apply(this))
          // this.$refs.form.reset()
        }
      }
    },
    methods: {
      ...mapActions('player', [
        'updateMultiple'
      ]),
      toggleAll () {
        if (this.selected.length) this.selected = []
        else this.selected = this.players.slice()
      },
      submit () {
        // Format selected player data
        let data = {}
        for (let i in this.selected) {
          const { id, ovr, value } = this.selected[i]
          data[id] = { ovr, value }
        }

        this.updateMultiple({
          teamId: this.team.id,
          players: data
        })
      }
    }
  }
</script>
