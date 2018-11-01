<template>
  <tr>
    <td
      v-for="(header, i) in headers"
      :key="i"
      :class="'text-xs-' + header.align">
      <template v-if="header.value === 'action'">
        <v-tooltip color="primary" bottom>
          <v-btn
            slot="activator"
            :to="{ name: 'players-id', params: { id: player.id } }"
            nuxt
            small
            icon>
            <v-icon color="primary" small>mdi-arrow-right</v-icon>
          </v-btn>
          View Player
        </v-tooltip>
        <v-btn
          v-if="header.width > 40"
          @click="edit = !edit"
          small
          icon>
          <v-icon
            :color="edit ? 'green' : 'orange'"
            small
          >mdi-{{ edit ? 'content-save' : 'pencil' }}</v-icon>
        </v-btn>
      </template>
      <template v-else-if="header.editable && edit">
        <v-select
          v-if="editOptions[header.value].type === 'select'"
          v-model="player[header.value]"
          :items="editOptions[header.value].items"
          :label="header.text"
          menu-props="auto"
        ></v-select>
        <v-text-field
          v-else-if="editOptions[header.value].type === 'money'"
          v-model="player[header.value]"
          :label="header.text"
          :hint="$_formatMoney(playerData[header.value])"
          :prefix="team.currency"
          persistent-hint
          type="number"
        ></v-text-field>
      </template>
      <template v-else>
        {{ getProperty(header.value, header.format) }}
      </template>
    </td>
  </tr>
</template>

<script>
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
      playerData: {
        type: Object,
        required: true
      },
      headers: {
        type: Array,
        required: true
      },
      actionWidth: Number
    },
    data: () => ({
      edit: false,
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
      player: {}
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
      actionWidth (val) {
        if (val < 125) {
          this.edit = false
        }
      },
      edit (val) {
        const { id, value, kit_no, ovr } = this.playerData
        if (val) {
          this.player = { id, value, kit_no, ovr }
        } else if (value !== this.player.value ||
                   kit_no !== this.player.kit_no ||
                   ovr !== this.player.ovr) {
          this.$store.dispatch('player/update', this.player)
        }
      }
    },
    methods: {
      getProperty (property, outputFormat) {
        const value = this.$_get(this.playerData, property, '')

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
      }
    }
  }
</script>

<style scoped>
  >>> .v-speed-dial__list {
    z-index: 1;
  }
</style>
