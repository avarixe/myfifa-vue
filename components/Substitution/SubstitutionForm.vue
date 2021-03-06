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
          v-model="substitution.player_id"
          :players="unsubbedPlayers"
          icon="mdi-subdirectory-arrow-left"
          required
        />
      </v-col>
      <v-col cols="12">
        <player-select
          v-model="substitution.replacement_id"
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
  import { activePlayers } from '@/models/Player'
  import { TeamAccessible, DialogFormable, MatchAccessible } from '@/mixins'

  export default {
    name: 'SubstitutionForm',
    mixins: [
      DialogFormable,
      MatchAccessible,
      TeamAccessible
    ],
    props: {
      record: { type: Object, default: null }
    },
    data: () => ({
      substitution: {
        player_id: null,
        replacement_id: '',
        injury: false
      }
    }),
    computed: {
      title () {
        return `${this.record ? 'Edit' : 'Record'} Substitution`
      },
      availablePlayers () {
        const selectedIds = this.sortedCaps.map(cap => cap.player_id)
        return activePlayers(this.team.id)
          .filter(player => {
            if (selectedIds.indexOf(player.id) < 0) {
              return true
            } else if (this.record) {
              return player.id === this.record.replacement_id
            }
          })
      },
      unsubbedPlayers () {
        return this.sortedCaps.filter(cap =>
          (cap.player_id !== this.substitution.replacement_id && !cap.subbed_out) ||
          (this.record && cap.player_id === this.record.player_id)
        )
      }
    },
    watch: {
      dialog (val) {
        if (val && this.record) {
          this.substitution = pick(this.record, [
            'id',
            'player_id',
            'replacement_id',
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
