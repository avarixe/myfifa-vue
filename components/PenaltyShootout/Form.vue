<template>
  <dialog-form
    v-model="dialog"
    title-icon="mdi-human"
    :title="title"
    :submit="submit"
    :color="color"
  >
    <template #activator="{ on }">
      <slot :on="on">
        <tooltip-button
          label="Penalty Shootout"
          icon="mdi-human"
          color="indigo"
          :on="on"
        />
      </slot>
    </template>

    <template #form>
      <v-col cols="6">
        <v-text-field
          v-model="penaltyShootout.home_score"
          :rules="$_validate('Home Score', ['required'])"
          type="number"
          :label="match.home"
          prepend-icon="mdi-soccer"
        />
      </v-col>
      <v-col cols="6">
        <v-text-field
          v-model="penaltyShootout.away_score"
          :rules="$_validate('Away Score', ['required'])"
          type="number"
          :label="match.away"
          prepend-icon="mdi-soccer"
        />
      </v-col>
    </template>
  </dialog-form>
</template>

<script>
  import { mixins, Component, Prop, Watch } from 'nuxt-property-decorator'
  import { mapActions } from 'vuex'
  import { TooltipButton } from '@/helpers'
  import { TeamAccessible, DialogFormable, MatchAccessible } from '@/mixins'

  const mix = mixins(TeamAccessible, DialogFormable, MatchAccessible)

  @Component({
    components: {
      TooltipButton
    },
    methods: mapActions('penaltyShootout', {
      create: 'CREATE',
      update: 'UPDATE'
    })
  })
  export default class PenaltyShootoutForm extends mix {
    @Prop(Object) record

    penaltyShootout = {
      home_score: null,
      away_score: null
    }

    get title () {
      return `${this.record ? 'Edit' : 'Record'} Penalty Shootout`
    }

    @Watch('dialog')
    setPenaltyShootout (val) {
      if (val && this.record) {
        Object.assign(this.penaltyShootout, this.$_pick(this.record, [
          'id',
          'home_score',
          'away_score'
        ]))
      }
    }

    async submit () {
      const save = this.record ? this.update : this.create

      await save({
        matchId: this.match.id,
        penaltyShootout: this.penaltyShootout
      })
    }
  }
</script>
