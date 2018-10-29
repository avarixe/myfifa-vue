<template>
  <tr>
    <td
      v-for="(header, i) in headers"
      :key="i"
      :class="'text-xs-' + header.align">
      <v-speed-dial
        v-if="header.text === 'Actions'"
        v-model="fab"
        direction="right">
        <v-btn
          slot="activator"
          v-model="fab"
          fab
          small>
          <v-icon>mdi-account</v-icon>
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-btn
          color="primary"
          dark
          nuxt
          :to="{ name: 'players-id', params: { id: player.id } }">
          {{ player.name }}
          <v-icon right>mdi-arrow-right</v-icon>
        </v-btn>
        <player-form :initial-player="player" color="orange">
          <v-tooltip bottom color="orange">
            <v-btn slot="activator" fab small color="orange" dark>
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            Edit
          </v-tooltip>
        </player-form>
        <transfer-form :player="player"></transfer-form>
        <contract-form :player="player"></contract-form>
        <injury-form
          v-if="active"
          :player="player"
        ></injury-form>
        <loan-form
          v-if="active"
          :player="player"
        ></loan-form>
        <player-remove :player="player"></player-remove>
      </v-speed-dial>
      <v-menu
        v-else-if="header.editable && editOptions[header.value].type === 'select'"
        max-height="200px"
        offset-y
        offset-overflow
        lazy>
        <span slot="activator">
          {{ getProperty(header.value, header.format) }}
        </span>
        <v-list>
          <v-list-tile
            v-for="item in editOptions[header.value].items"
            :key="item"
            @click="updatePlayer(header.value, item)">
            {{ item }}
          </v-list-tile>
        </v-list>
      </v-menu>
      <v-edit-dialog
        v-else-if="header.editable && editOptions[header.value].type === 'money'"
        @save="updatePlayer(header.value, playerData[header.value])"
        large
        persistent
        lazy>
        <span :class="'text-xs-' + header.align">
          {{ getProperty(header.value, header.format) }}
        </span>
        <v-text-field
          slot="input"
          v-model="playerData[header.value]"
          type="number"
          single-line
          autofocus
        ></v-text-field>
      </v-edit-dialog>
      <span v-else>
        {{ getProperty(header.value, header.format) }}
      </span>
    </td>
  </tr>
</template>

<script>
  import { mapActions } from 'vuex'
  import TeamAccessible from '@/mixins/TeamAccessible'
  import PlayerForm from '@/components/Player/PlayerForm'
  import ContractForm from '@/components/Player/ContractForm'
  import InjuryForm from '@/components/Player/InjuryForm'
  import LoanForm from '@/components/Player/LoanForm'
  import TransferForm from '@/components/Player/TransferForm'
  import PlayerRemove from '@/components/Player/PlayerRemove'

  export default {
    components: {
      PlayerForm,
      ContractForm,
      InjuryForm,
      LoanForm,
      TransferForm,
      PlayerRemove
    },
    mixins: [ TeamAccessible ],
    props: {
      player: {
        type: Object,
        required: true
      },
      headers: {
        type: Array,
        required: true
      }
    },
    data: () => ({
      editOptions: {
        kit_no: {
          type: 'select',
          items: Array.from({ length: 98 }, (v, k) => k + 1)
        },
        ovr: {
          type: 'select',
          items: Array.from({ length: 61 }, (v, k) => k + 40)
        },
        value: {
          type: 'money'
        }
      },
      fab: false,
      playerData: {}
    }),
    computed: {
      active () {
        return this.player.status && this.player.status.length > 0
      },
      transferOut () {
        return this.active
      }
    },
    watch: {
      player: {
        immediate: true,
        handler: function (val) {
          const { value } = this.player
          this.playerData = { value }
        }
      }
    },
    methods: {
      ...mapActions('player', [
        'update'
      ]),
      getProperty (property, outputFormat) {
        const value = this.$_get(this.player, property, '')

        if (!value) return '-'

        switch (outputFormat) {
          case 'money':
            return this.team.currency + value.toLocaleString()
          case 'array':
            return value.toString()
          case 'date':
            return this.$_format(this.$_parse(value), 'MMM D, YYYY')
          case 'years':
            return value + ' Years'
          case 'actions':
            return ''
          default:
            return value
        }
      },
      updatePlayer (property, value) {
        this.update({
          id: this.player.id,
          [property]: value
        })
      }
    }
  }
</script>

<style scoped>
  >>> .v-speed-dial__list {
    z-index: 1;
  }
</style>
