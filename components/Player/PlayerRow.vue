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
            :to="playerLink"
            nuxt
            small
            icon>
            <v-icon color="primary" small>mdi-arrow-right</v-icon>
          </v-btn>
          View Player
        </v-tooltip>
        <v-tooltip
          v-if="header.width > 40"
          :color="editButton.color"
          bottom>
          <v-btn
            slot="activator"
            @click="edit = !edit"
            small
            icon>
            <v-icon
              :color="editButton.color"
              small
            >mdi-{{ editButton.icon }}</v-icon>
          </v-btn>
          {{ editButton.text }}
        </v-tooltip>
      </template>
      <template v-else-if="header.value === 'status' && playerData.status">
        <v-icon :color="statusColor">
          mdi-{{ statusIcon }}
        </v-icon>
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
          :hint="$_formatMoney(player[header.value])"
          :prefix="team.currency"
          persistent-hint
          type="number"
        ></v-text-field>
      </template>
      <template v-else>
        {{ getProperty(header.view || header.value, header.format) }}
      </template>
    </td>
  </tr>
</template>

<script>
  import TeamAccessible from '@/mixins/TeamAccessible'

  export default {
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
      playerLink () {
        return {
          name: 'teams-id-players-playerId',
          params: {
            id: this.team.id,
            playerId: this.playerData.id
          }
        }
      },
      active () {
        return this.playerData.status && this.playerData.status.length > 0
      },
      statusColor () {
        switch (this.playerData.status) {
          case 'Active':
            return 'light-green'
          case 'Loaned':
            return 'indigo'
          case 'Injured':
            return 'pink'
        }
      },
      statusIcon () {
        switch (this.playerData.status) {
          case 'Active':
            return 'account-check'
          case 'Loaned':
            return 'transit-transfer'
          case 'Injured':
            return 'hospital'
        }
      },
      playerChanged () {
        const { value, kit_no: kitNo, ovr } = this.playerData
        return value !== this.player.value ||
               kitNo !== this.player.kit_no ||
               ovr !== this.player.ovr
      },
      editButton () {
        if (!this.edit) {
          return { text: 'Edit', icon: 'pencil', color: 'orange' }
        } else if (this.playerChanged) {
          return { text: 'Save', icon: 'content-save', color: 'green' }
        } else {
          return { text: 'Cancel', icon: 'close', color: 'black' }
        }
      }
    },
    watch: {
      actionWidth (val) {
        if (val < 125) {
          this.edit = false
        }
      },
      edit (val) {
        if (val) {
          // eslint-disable-next-line camelcase
          const { id, value, kit_no, ovr } = this.playerData
          this.player = { id, value, kit_no, ovr }
        } else if (this.playerChanged) {
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
          case 'fixed':
            return value.toFixed(2)
          case 'actions':
            return ''
          default:
            return value
        }
      }
    }
  }
</script>
