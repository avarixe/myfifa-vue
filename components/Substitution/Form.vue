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
  import { mixins, Component, Prop, Watch } from 'nuxt-property-decorator'
  import { mapActions } from 'vuex'
  import { activePlayers } from '@/models/Player'
  import { MinuteField, PlayerSelect, TooltipButton } from '@/helpers'
  import { TeamAccessible, DialogFormable, MatchAccessible } from '@/mixins'

  const mix = mixins(DialogFormable, MatchAccessible, TeamAccessible)

  @Component({
    components: {
      MinuteField,
      PlayerSelect,
      TooltipButton
    },
    methods: mapActions('substitutions', {
      create: 'CREATE',
      update: 'UPDATE'
    })
  })
  export default class SubstitutionForm extends mix {
    @Prop(Object) record

    substitution = {
      player_id: null,
      replacement_id: '',
      injury: false
    }

    get title () {
      return `${this.record ? 'Edit' : 'Record'} Substitution`
    }

    get availablePlayers () {
      const selectedIds = this.sortedCaps.map(cap => cap.player_id)
      return activePlayers(this.team.id)
        .filter(player => {
          if (selectedIds.indexOf(player.id) < 0) {
            return true
          } else if (this.record) {
            return player.id === this.record.replacement_id
          }
        })
    }

    get unsubbedPlayers () {
      return this.sortedCaps.filter(cap =>
        (cap.player_id !== this.substitution.replacement_id && !cap.subbed_out) ||
        (this.record && cap.player_id === this.record.player_id)
      )
    }

    @Watch('dialog')
    setSubstitution (val) {
      if (val && this.record) {
        this.substitution = this.$_pick(this.record, [
          'id',
          'player_id',
          'replacement_id',
          'injury'
        ])
        this.minute = this.record.minute
      }
    }

    async submit () {
      const substitution = {
        ...this.substitution,
        minute: this.minute
      }

      if (this.record) {
        await this.update(substitution)
      } else {
        await this.create({
          matchId: this.match.id,
          substitution
        })
      }
    }
  }
</script>
