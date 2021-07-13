<template>
  <dialog-form
    v-model="dialog"
    title-icon="mdi-repeat"
    :title="title"
    :submit="submit"
    :color="color"
  >
    <template #activator="{ on }">
      <slot :on="on">
        <tooltip-button
          label="Substitution"
          icon="mdi-repeat"
          color="green"
          :on="on"
        />
      </slot>
    </template>
    <template #form>
      <v-col cols="12">
        <minute-field v-model="minute" />
      </v-col>
      <v-col cols="12">
        <player-select
          v-model="substitution.playerId"
          :players="unsubbedPlayers"
          icon="mdi-subdirectory-arrow-left"
          required
        />
      </v-col>
      <v-col cols="12">
        <player-select
          v-model="substitution.replacementId"
          :players="availablePlayers"
          item-value="id"
          label="Replaced By"
          icon="mdi-subdirectory-arrow-right"
          required
        />
      </v-col>
      <v-col cols="12">
        <v-checkbox
          v-model="substitution.injury"
          label="Injury"
          hide-details
        />
      </v-col>
    </template>
  </dialog-form>
</template>

<script>
  import { mapActions } from 'vuex'
  import pick from 'lodash.pick'
  import { ActivePlayerSelectable, DialogFormable, MatchAccessible } from '@/mixins'

  export default {
    name: 'SubstitutionForm',
    mixins: [
      ActivePlayerSelectable,
      DialogFormable,
      MatchAccessible
    ],
    props: {
      record: { type: Object, default: null }
    },
    data: () => ({
      substitution: {
        playerId: null,
        replacementId: '',
        injury: false
      }
    }),
    computed: {
      title () {
        return `${this.record ? 'Edit' : 'Record'} Substitution`
      },
      availablePlayers () {
        const selectedIds = this.sortedCaps.map(cap => cap.playerId)
        return this.activePlayers.filter(player => {
          if (selectedIds.indexOf(player.id) < 0) {
            return true
          } else if (this.record) {
            return player.id === this.record.replacementId
          }
        })
      },
      unsubbedPlayers () {
        return this.sortedCaps.filter(cap =>
          (cap.playerId !== this.substitution.replacementId && !cap.subbedOut) ||
          (this.record && cap.playerId === this.record.playerId)
        )
      }
    },
    watch: {
      dialog (val) {
        if (val && this.record) {
          this.substitution = pick(this.record, [
            'id',
            'playerId',
            'replacementId',
            'injury'
          ])
          this.minute = this.record.minute
        }
      }
    },
    methods: {
      ...mapActions('substitutions', {
        createSubstitution: 'create',
        updateSubstitution: 'update'
      }),
      async submit () {
        const substitution = {
          ...this.substitution,
          minute: this.minute
        }

        if (this.record) {
          await this.updateSubstitution(substitution)
        } else {
          await this.createSubstitution({
            matchId: this.match.id,
            substitution
          })
        }
      }
    }
  }
</script>
