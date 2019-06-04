<template>
  <v-tooltip v-model="tooltip" bottom>
    <template #activator="{ on }">
      <tr
        v-on="!editable && on"
        @click="!editable && goToPlayer"
      >
        <td
          v-for="(header, i) in headers"
          :key="i"
          :class="'text-xs-' + header.align"
        >
          <template v-if="header.value === 'edit'">
            <edit-mode-button
              :mode="edit"
              :changed="playerChanged"
              dir="right"
              @toggle-mode="edit = !edit"
            />
          </template>
          <template v-else-if="header.value === 'status' && playerData.status">
            <v-icon :color="statusColor">mdi-{{ statusIcon }}</v-icon>
          </template>
          <template v-else-if="header.editable && edit">
            <v-select
              v-if="editOptions[header.value].type === 'select'"
              v-model="player[header.value]"
              :items="editOptions[header.value].items"
              :label="header.text"
              menu-props="auto"
              hide-details
            />
            <v-text-field
              v-else-if="editOptions[header.value].type === 'money'"
              v-model="player[header.value]"
              :label="header.text"
              :hint="$_formatMoney(player[header.value])"
              :prefix="team.currency"
              persistent-hint
              type="number"
            />
          </template>
          <template v-else>
            {{ getProperty(header.view || header.value, header.format) }}
          </template>
        </td>
      </tr>
    </template>
    Click to View Player:
    <i>{{ playerData.name }}</i>
  </v-tooltip>
</template>

<script>
  import { EditModeButton } from '@/helpers'
  import { TeamAccessible } from '@/mixins'

  export default {
    components: {
      EditModeButton
    },
    mixins: [
      TeamAccessible
    ],
    props: {
      playerData: {
        type: Object,
        required: true
      },
      headers: {
        type: Array,
        required: true
      },
      mode: Number
    },
    data: () => ({
      tooltip: false,
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
      editable () {
        return this.mode === 1
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
          case 'Pending':
            return 'deep-orange'
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
          case 'Pending':
            return 'lock-clock'
        }
      },
      playerChanged () {
        const { value, kit_no: kitNo, ovr } = this.playerData
        return value !== this.player.value ||
               kitNo !== this.player.kit_no ||
               ovr !== this.player.ovr
      }
    },
    watch: {
      mode (val) {
        if (val > 0) {
          this.edit = false
        }
      },
      edit (val) {
        if (val) {
          // eslint-disable-next-line camelcase
          const { id, value, kit_no, ovr } = this.playerData
          this.player = { id, value, kit_no, ovr }
        } else if (this.playerChanged) {
          this.$store.dispatch('players/UPDATE', this.player)
        }
      }
    },
    methods: {
      goToPlayer () {
        this.$router.push({
          name: 'teams-teamId-players-playerId',
          params: {
            teamId: this.team.id,
            playerId: this.playerData.id
          }
        })
      },
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
